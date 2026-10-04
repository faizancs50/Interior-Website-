import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle,
  FileEdit,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load dashboard metrics.');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  return (
    <div className="admin-dashboard-page">
      {/* Welcome Banner */}
      <div className="dashboard-welcome-banner">
        <div>
          <span className="dashboard-eyebrow">STUDIO MANAGEMENT CONSOLE</span>
          <h1 className="dashboard-heading">
            Welcome back, {user?.name?.split(' ')[0] || 'Administrator'}
          </h1>
          <p className="dashboard-sub">
            Review your published architecture portfolio, draft proposals, and recent project entries.
          </p>
        </div>

        <div className="dashboard-banner-actions">
          <Link to="/admin/projects/new" className="btn btn-primary">
            <PlusCircle size={16} />
            <span>Add New Project</span>
          </Link>
        </div>
      </div>

      {error && <div className="admin-error-notice">{error}</div>}

      {/* 4 Stats Cards */}
      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-title">Total Projects</span>
            <div className="stat-icon-wrap total">
              <FolderKanban size={20} />
            </div>
          </div>
          <div className="stat-value">{loading ? '—' : stats?.total || 0}</div>
          <span className="stat-footer-text">In studio database</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-title">Published Works</span>
            <div className="stat-icon-wrap published">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="stat-value">{loading ? '—' : stats?.published || 0}</div>
          <span className="stat-footer-text">Live on public portfolio</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-title">Draft Works</span>
            <div className="stat-icon-wrap draft">
              <FileEdit size={20} />
            </div>
          </div>
          <div className="stat-value">{loading ? '—' : stats?.draft || 0}</div>
          <span className="stat-footer-text">Hidden from public visitors</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-title">Featured Highlights</span>
            <div className="stat-icon-wrap featured">
              <Sparkles size={20} />
            </div>
          </div>
          <div className="stat-value">{loading ? '—' : stats?.featured || 0}</div>
          <span className="stat-footer-text">Spotlighted on homepage</span>
        </div>
      </div>

      {/* Recently Added / Updated Projects Section */}
      <div className="dashboard-recent-section">
        <div className="dashboard-section-header">
          <div>
            <h2 className="section-block-title">Recently Added &amp; Updated Projects</h2>
            <p className="section-block-sub">Latest projects managed through the studio system.</p>
          </div>
          <Link to="/admin/projects" className="btn-link">
            <span>View All Projects</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="admin-table-loading">Loading recent projects...</div>
        ) : stats?.recent?.length === 0 ? (
          <div className="admin-empty-state">
            <p>No projects recorded in the system yet.</p>
            <Link to="/admin/projects/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Create Your First Project
            </Link>
          </div>
        ) : (
          <div className="recent-projects-list">
            {stats?.recent?.map((proj) => (
              <div key={proj.id} className="recent-project-row">
                <div className="recent-img-thumb">
                  <img src={proj.coverImage} alt={proj.title} />
                </div>

                <div className="recent-info-block">
                  <div className="recent-title-row">
                    <h4 className="recent-proj-title">{proj.title}</h4>
                    <span className={`status-pill ${proj.status}`}>
                      {proj.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    {proj.featured && <span className="featured-pill">Featured</span>}
                  </div>

                  <div className="recent-meta-strip">
                    <span className="recent-meta-item">
                      <Layers size={13} /> {proj.category}
                    </span>
                    {proj.location && (
                      <span className="recent-meta-item">
                        <MapPin size={13} /> {proj.location}
                      </span>
                    )}
                    <span className="recent-meta-item">
                      <Clock size={13} />{' '}
                      {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString('en-SG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="recent-actions-block">
                  <Link
                    to={`/admin/projects/edit/${proj.id}`}
                    className="btn btn-outline recent-edit-btn"
                  >
                    Edit
                  </Link>
                  {proj.status === 'published' && (
                    <Link
                      to={`/projects/${proj.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="recent-view-link"
                      title="View public page"
                    >
                      <ExternalLink size={16} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
