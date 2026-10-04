import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

/**
 * Service to handle Google Sheets integration using the official googleapis library.
 * Flow:
 *   Enquiry -> GoogleSheetsService.appendEnquiry() -> Google Sheets API -> Google Sheet
 */
export class GoogleSheetsService {
  constructor() {
    this.sheetsClient = null;
    this.authClient = null;
  }

  /**
   * Check if Google Sheets environment variables are properly configured.
   */
  isConfigured() {
    if (process.env.TEST_MOCK_GOOGLE_SHEETS === 'true') {
      return true;
    }

    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    if (!spreadsheetId) return false;

    // Check if service account file exists
    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (credPath && fs.existsSync(credPath)) {
      return true;
    }

    // Check if inline service account email and private key exist
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    if (email && privateKey) {
      return true;
    }

    return false;
  }

  /**
   * Return a list of missing configuration keys for diagnostics.
   */
  getMissingConfig() {
    if (process.env.TEST_MOCK_GOOGLE_SHEETS === 'true') {
      return [];
    }

    const missing = [];
    if (!process.env.GOOGLE_SPREADSHEET_ID) missing.push('GOOGLE_SPREADSHEET_ID');

    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const hasCredFile = credPath && fs.existsSync(credPath);

    if (!hasCredFile) {
      if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) missing.push('GOOGLE_SERVICE_ACCOUNT_EMAIL');
      if (!process.env.GOOGLE_PRIVATE_KEY) missing.push('GOOGLE_PRIVATE_KEY');
    }

    return missing;
  }

  /**
   * Initialize and return Google Auth Client using Service Account credentials.
   */
  getAuth() {
    if (this.authClient) return this.authClient;

    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (credPath && fs.existsSync(credPath)) {
      this.authClient = new google.auth.GoogleAuth({
        keyFile: credPath,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });
      return this.authClient;
    }

    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    let key = process.env.GOOGLE_PRIVATE_KEY || '';

    if (!email || !key) {
      const missing = this.getMissingConfig().join(', ');
      throw new Error(`Google Sheets credentials missing (${missing}). Please configure your environment variables.`);
    }

    // Strip wrapping quotes if present
    if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
      key = key.slice(1, -1);
    }
    // Handle literal escaped newlines "\n" from .env
    key = key.replace(/\\n/g, '\n');

    this.authClient = new google.auth.JWT({
      email,
      key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    return this.authClient;
  }

  /**
   * Get Google Sheets API client.
   */
  getSheets() {
    if (this.sheetsClient) return this.sheetsClient;
    const auth = this.getAuth();
    this.sheetsClient = google.sheets({ version: 'v4', auth });
    return this.sheetsClient;
  }

  /**
   * Inspect spreadsheet to resolve the target sheet/tab title.
   * If the requested tab does not exist, uses the first existing tab or creates the tab.
   */
  async resolveSheetTitle(sheets, spreadsheetId, requestedTitle) {
    try {
      const meta = await sheets.spreadsheets.get({ spreadsheetId });
      const sheetsList = meta.data.sheets || [];

      if (sheetsList.length === 0) {
        return requestedTitle || 'Sheet1';
      }

      // Check for case-insensitive match
      const matched = sheetsList.find(
        (s) => s.properties && s.properties.title.toLowerCase() === requestedTitle.toLowerCase()
      );
      if (matched) {
        return matched.properties.title;
      }

      // If requested title was explicitly specified (e.g. 'Enquiries') and doesn't exist, create it
      if (requestedTitle && requestedTitle !== 'Sheet1') {
        try {
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
              requests: [
                {
                  addSheet: {
                    properties: {
                      title: requestedTitle
                    }
                  }
                }
              ]
            }
          });
          return requestedTitle;
        } catch (createErr) {
          // If creation fails (e.g. permission or quota), fallback to first sheet
          console.warn('[GoogleSheets] Could not add sheet tab, falling back to first sheet:', createErr.message);
        }
      }

      // Fallback to first available sheet tab
      return sheetsList[0].properties.title || 'Sheet1';
    } catch (err) {
      // Return requested title if metadata retrieval fails
      return requestedTitle || 'Sheet1';
    }
  }

  /**
   * Verify and initialize headers on row 1 if the sheet is empty.
   * Preserves any existing rows or existing header labels.
   */
  async ensureHeaders(sheets, spreadsheetId, sheetTitle) {
    const DEFAULT_HEADERS = [
      'Date & Time',
      'Name',
      'Phone',
      'Email',
      'Project Type',
      'Location',
      'Budget',
      'Message',
      'Status'
    ];

    try {
      // Check first row (A1:I1)
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'${sheetTitle}'!A1:I1`
      });

      const firstRow = res.data.values && res.data.values[0];

      // If sheet has no row 1 values at all, write default headers
      if (!firstRow || firstRow.length === 0 || firstRow.every((val) => !val || String(val).trim() === '')) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `'${sheetTitle}'!A1:I1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [DEFAULT_HEADERS]
          }
        });
      }
    } catch (err) {
      // If error occurs (e.g. invalid range on empty sheet), attempt to write A1:I1
      try {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `'${sheetTitle}'!A1:I1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [DEFAULT_HEADERS]
          }
        });
      } catch (innerErr) {
        console.warn('[GoogleSheets] Note checking/writing headers:', innerErr.message);
      }
    }
  }

  /**
   * Append an enquiry as a brand-new row in Google Sheets.
   * Uses valueInputOption: 'USER_ENTERED' and insertDataOption: 'INSERT_ROWS'
   * to guarantee existing data is never overwritten.
   */
  async appendEnquiry(enquiry, options = {}) {
    // Test mock mode for automated integration testing
    if (process.env.TEST_MOCK_GOOGLE_SHEETS === 'true' || options.mock === true) {
      return {
        updatedRange: `${process.env.GOOGLE_SHEET_NAME || 'Enquiries'}!A2:I2`,
        updatedRows: 1,
        sheetTitle: process.env.GOOGLE_SHEET_NAME || 'Enquiries',
        isMock: true
      };
    }

    if (!this.isConfigured()) {
      const missing = this.getMissingConfig().join(', ');
      throw new Error(`Google Sheets integration is unconfigured. Missing: ${missing}`);
    }

    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const requestedSheetName = process.env.GOOGLE_SHEET_NAME || 'Enquiries';
    const sheets = this.getSheets();

    // 1. Resolve active sheet title
    const sheetTitle = await this.resolveSheetTitle(sheets, spreadsheetId, requestedSheetName);

    // 2. Ensure headers exist without overwriting
    await this.ensureHeaders(sheets, spreadsheetId, sheetTitle);

    // 3. Format row data exactly matching the columns
    const rowValues = [
      enquiry.submittedAtFormatted || enquiry.submittedAt || new Date().toISOString(),
      enquiry.name || '',
      enquiry.phone || '',
      enquiry.email || '',
      enquiry.projectType || 'Architecture',
      enquiry.location || 'Singapore',
      enquiry.budget || 'Not specified',
      enquiry.message || '',
      enquiry.status || 'New'
    ];

    // 4. Append row below existing data
    const appendRes = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${sheetTitle}'!A:I`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowValues]
      }
    });

    return {
      updatedRange: appendRes.data.updates?.updatedRange,
      updatedRows: appendRes.data.updates?.updatedRows,
      sheetTitle
    };
  }
}

export const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;
