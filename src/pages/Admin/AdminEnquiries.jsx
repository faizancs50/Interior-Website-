import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Inbox
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminEnquiries.css';

const AdminEnquiries = () => {
  const { token } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [configStatus, setConfigStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [syncFilter, setSyncFilter] = useState('All');
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [enqRes, configRes] = await Promise.all([
        fetch('/api/enquiries/admin/all', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/enquiries/admin/config-status', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (enqRes.ok) {
        const enqData = await enqRes.json();
        setEnquiries(enqData.enquiries || []);
      } else {
        throw new Error('Failed to load enquiries log.');
      }

      if (configRes.ok) {
        const cfgData = await configRes.json();
        setConfigStatus(cfgData);
      }
    } catch (err) {
      setError(err.message || 'Error communicating with server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  // Filtered enquiries
  const filtered = enquiries.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      item.name?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.phone?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q) ||
      item.message?.toLowerCase().includes(q);

    const matchesType =
      typeFilter === 'All' ||
      item.projectType?.toLowerCase().includes(typeFilter.toLowerCase());

    const matchesSync =
      syncFilter === 'All' ||
      (syncFilter === 'Synced' && item.googleSheetsSynced) ||
      (syncFilter === 'NotSynced' && !item.googleSheetsSynced);

    return matchesSearch && matchesType && matchesSync;
  });

  return (
    <div className="admin-enquiries-page">
      {/* Page Header */}
      <div className="enquiries-header">
        <div>
          <span className="enquiries-eyebrow">LEAD CAPTURE &amp; INTEGRATIONS</span>
          <h1 className="enquiries-title">Client Enquiries &amp; Google Sheets</h1>
          <p className="enquiries-sub">
            All enquiry forms submitted on the website are recorded here and automatically appended to your connected Google Sheet.
          </p>
        </div>

        <div className="enquiries-header-actions">
          <button
            type="button"
            onClick={fetchData}
            className="btn btn-outline"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'submit-spinner' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Integration Status Banner */}
      <div className="sheets-integration-card">
        <div className="sheets-integration-top">
          <div className="sheets-status-indicator">
            <span
              className={`status-dot ${
                configStatus?.configured ? 'active' : 'pending'
              }`}
            />
            <span>
              Google Sheets Integration:{' '}
              {configStatus?.configured ? 'Active & Linked' : 'Pending .env Setup'}
            </span>
          </div>

          <div className="sheets-meta-badges">
            <span className="sheets-badge">
              Target Tab: <strong>{configStatus?.sheetName || 'Enquiries'}</strong>
            </span>
            {configStatus?.spreadsheetIdMasked && (
              <span className="sheets-badge">
                Spreadsheet: <strong>{configStatus.spreadsheetIdMasked}</strong>
              </span>
            )}
            <span className="sheets-badge">
              Total Enquiries: <strong>{enquiries.length}</strong>
            </span>
          </div>
        </div>

        <div className="sheets-explainer">
          {configStatus?.configured ? (
            <p>
              ✓ Every website submission creates a <strong>new row</strong> in your connected Google Sheet with the 9 standard columns (Date &amp; Time, Name, Phone, Email, Project Type, Location, Budget, Message, Status).
            </p>
          ) : (
            <p>
              To complete live sync, set <code>GOOGLE_SPREADSHEET_ID</code>, <code>GOOGLE_SERVICE_ACCOUNT_EMAIL</code>, and <code>GOOGLE_PRIVATE_KEY</code> in your <code>.env</code> file, then share your Google Sheet with your service account email as <strong>Editor</strong>. In the meantime, all enquiries are safely preserved in the database.
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="admin-error-notice" role="alert">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="enquiries-controls-bar">
        <div className="enquiries-search-input-wrap">
          <Search size={16} className="enquiries-search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, phone, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="enquiries-search-input"
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="enquiries-filter-select"
          >
            <option value="All">All Project Types</option>
            <option value="Architecture">Architecture</option>
            <option value="Interior Design">Interior Design</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={syncFilter}
            onChange={(e) => setSyncFilter(e.target.value)}
            className="enquiries-filter-select"
          >
            <option value="All">All Sync Statuses</option>
            <option value="Synced">Synced to Google Sheets</option>
            <option value="NotSynced">Database Only / Pending</option>
          </select>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="enquiries-table-card">
        {loading ? (
          <div className="enquiries-empty-state">
            <RefreshCw size={24} className="submit-spinner" style={{ margin: '0 auto 1rem' }} />
            <p>Loading enquiries log...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="enquiries-empty-state">
            <Inbox size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No enquiries found matching your filter criteria.</p>
          </div>
        ) : (
          <table className="enquiries-table">
            <thead>
              <tr>
                <th>Date / Time</th>
                <th>Client Contact</th>
                <th>Project &amp; Location</th>
                <th>Budget Tier</th>
                <th>Message / Brief</th>
                <th>Google Sheets Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((enq) => (
                <tr key={enq.id}>
                  <td>
                    <span style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      {enq.submittedAtFormatted || new Date(enq.createdAt).toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span className="client-name-cell">{enq.name}</span>
                    <span className="client-contact-cell">{enq.email}</span>
                    <span className="client-contact-cell">{enq.phone}</span>
                  </td>
                  <td>
                    <span className="project-type-tag">{enq.projectType}</span>
                    <span className="location-text">📍 {enq.location}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem' }}>{enq.budget || 'Not specified'}</span>
                  </td>
                  <td>
                    <div className="enquiry-msg-box" title={enq.message}>
                      {enq.message}
                    </div>
                  </td>
                  <td>
                    {enq.googleSheetsSynced ? (
                      <span className="sync-status-badge synced">
                        <CheckCircle2 size={13} />
                        <span>Synced to Sheet</span>
                      </span>
                    ) : enq.googleSheetsError ? (
                      <span
                        className="sync-status-badge failed"
                        title={enq.googleSheetsError}
                      >
                        <AlertCircle size={13} />
                        <span>Sync Failed</span>
                      </span>
                    ) : (
                      <span className="sync-status-badge database-only">
                        <ShieldCheck size={13} />
                        <span>Saved in DB</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminEnquiries;
