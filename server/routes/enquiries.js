import express from 'express';
import { db } from '../db.js';
import { googleSheetsService } from '../services/googleSheets.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// In-memory cache for recent submissions to prevent rapid duplicate clicks/submits
const recentSubmissions = new Map();
const SUBMISSION_COOLDOWN_MS = 8000; // 8 seconds cooldown per email+fingerprint

// Clean up old entries from memory cache periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of recentSubmissions.entries()) {
    if (now - timestamp > SUBMISSION_COOLDOWN_MS * 2) {
      recentSubmissions.delete(key);
    }
  }
}, 30000);

/**
 * Helper to validate email format
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Helper to validate phone format (allows + country code, spaces, dashes, parentheses)
 */
function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  return /^[0-9+() -]{7,20}$/.test(phone.trim());
}

/**
 * POST /api/enquiries
 * Public route to submit an enquiry.
 * Flow:
 *   Visitor -> Validate -> DB (server/db.js) -> Google Sheets API -> Google Sheet
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, projectType, location, budget, message } = req.body;

    // 1. Backend Validation
    const errors = {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.name = 'Please provide your full name (minimum 2 characters).';
    }

    if (!isValidEmail(email)) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!isValidPhone(phone)) {
      errors.phone = 'Please provide a valid phone number (minimum 7 digits).';
    }

    if (!location || typeof location !== 'string' || location.trim().length < 2) {
      errors.location = 'Please provide your project location or area.';
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      errors.message = 'Please provide a brief note about your project (minimum 5 characters).';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please correct the highlighted errors.',
        errors
      });
    }

    // 2. Prevent accidental duplicate rapid submissions
    const cleanEmail = email.trim().toLowerCase();
    const cleanMsg = message.trim().toLowerCase().substring(0, 30);
    const fingerprint = `${cleanEmail}:${cleanMsg}`;
    const now = Date.now();

    if (recentSubmissions.has(fingerprint)) {
      const lastTime = recentSubmissions.get(fingerprint);
      if (now - lastTime < SUBMISSION_COOLDOWN_MS) {
        return res.status(429).json({
          success: false,
          message: 'An enquiry with these details was just submitted. Please allow a few moments before sending another.'
        });
      }
    }
    recentSubmissions.set(fingerprint, now);

    // 3. Save to existing Database alongside Google Sheets
    const enquiryRecord = db.createEnquiry({
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      projectType: projectType ? projectType.trim() : 'Architecture',
      location: location.trim(),
      budget: budget ? budget.trim() : 'Not specified',
      message: message.trim(),
      status: 'New'
    });

    // 4. Synchronize with Google Sheets API
    try {
      const isTestMock =
        process.env.NODE_ENV !== 'production' &&
        (req.headers['x-test-mock-sheets'] === 'true' || process.env.TEST_MOCK_GOOGLE_SHEETS === 'true');
      const sheetResult = await googleSheetsService.appendEnquiry(enquiryRecord, { mock: isTestMock });

      // Update database record with sync success
      db.updateEnquiry(enquiryRecord.id, {
        googleSheetsSynced: true,
        googleSheetsRange: sheetResult.updatedRange,
        googleSheetsTitle: sheetResult.sheetTitle,
        syncedAt: new Date().toISOString()
      });

      return res.status(201).json({
        success: true,
        message: 'Thank you! Your enquiry has been received. Our team will contact you shortly.',
        enquiryId: enquiryRecord.id
      });
    } catch (sheetErr) {
      // Secure logging: log the error message on the backend without leaking keys or credentials
      console.error(`[GoogleSheets Sync Error]: ${sheetErr.message}`);

      // Record sync failure in database for auditing
      db.updateEnquiry(enquiryRecord.id, {
        googleSheetsSynced: false,
        googleSheetsError: sheetErr.message
      });

      // According to requirement:
      // "If Google Sheets fails, do NOT show a fake success message. Show an appropriate error message and log the actual error securely on the backend."
      return res.status(502).json({
        success: false,
        message: 'We were unable to record your enquiry into our scheduling system at this time. Please try again shortly or contact us directly at enquiry@carpenters.com.sg.'
      });
    }
  } catch (err) {
    console.error('[Enquiry Endpoint Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred while processing your enquiry. Please try again.'
    });
  }
});

/**
 * GET /api/enquiries/admin/all
 * Protected route for authorized admins (Owner & Developer) to view received enquiries.
 * Normal visitors have NO access.
 */
router.get('/admin/all', requireAdmin, (req, res) => {
  try {
    const enquiries = db.getAllEnquiries();
    return res.json({
      success: true,
      total: enquiries.length,
      enquiries
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve enquiries' });
  }
});

/**
 * GET /api/enquiries/admin/config-status
 * Protected route for authorized admins to check Google Sheets connection status.
 */
router.get('/admin/config-status', requireAdmin, (req, res) => {
  try {
    const isConfigured = googleSheetsService.isConfigured();
    const missing = googleSheetsService.getMissingConfig();
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const maskedId = spreadsheetId
      ? `${spreadsheetId.substring(0, 5)}...${spreadsheetId.substring(spreadsheetId.length - 4)}`
      : null;

    return res.json({
      success: true,
      configured: isConfigured,
      missing,
      spreadsheetIdMasked: maskedId,
      sheetName: process.env.GOOGLE_SHEET_NAME || 'Enquiries'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve configuration status' });
  }
});

export default router;
