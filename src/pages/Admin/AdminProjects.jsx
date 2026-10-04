import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Filter,
  Eye,
  EyeOff,
  Star,
  Edit3,
  Trash2,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  X,
  Layers,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminProjects.css';

const AdminProjects = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Deletion Modal
  const [deleteModalTarget, setDeleteModalTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to retrieve projects list.');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [token]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Toggle publish
  const handleTogglePublish = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/projects/admin/${id}/publish`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update project status.');

      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: data.project.status } : p))
      );
      showToast(
        data.project.status === 'published'
          ? 'Project published successfully.'
          : 'Project saved as draft.'
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Toggle featured
  const handleToggleFeatured = async (id) => {
    try {
      const res = await fetch(`/api/projects/admin/${id}/featured`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update featured status.');

      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: data.project.featured } : p))
      );
      showToast(
        data.project.featured
          ? 'Project marked as featured highlight.'
          : 'Project unmarked from featured.'
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!deleteModalTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/admin/${deleteModalTarget.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete project.');
      }

      setProjects((prev) => prev.filter((p) => p.id !== deleteModalTarget.id));
      showToast(`"${deleteModalTarget.title}" deleted successfully.`);
      setDeleteModalTarget(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered list
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ? true : p.status === statusFilter;

    const matchesCat =
      categoryFilter === 'all'
        ? true
        : p.category && p.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCat;
  });

  return (
    <div className="admin-projects-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast-banner" role="status">
          <CheckCircle size={18} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="projects-header-bar">
        <div>
          <span className="dashboard-eyebrow">PORTFOLIO DATABASE</span>
          <h1 className="projects-page-title">Project Management</h1>
          <p className="projects-page-sub">
            Add, curate, edit, and organize all public and draft interior architecture projects.
          </p>
        </div>

        <Link to="/admin/projects/new" className="btn btn-primary add-project-btn">
          <PlusCircle size={16} />
          <span>Add New Project</span>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="projects-filters-card">
        <div className="filter-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, location, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-search-input"
          />
        </div>

        <div className="filter-selects-row">
          <div className="filter-select-group">
            <span className="filter-label">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Statuses ({projects.length})</option>
              <option value="published">
                Published ({projects.filter((p) => p.status === 'published').length})
              </option>
              <option value="draft">
                Drafts ({projects.filter((p) => p.status === 'draft').length})
              </option>
            </select>
          </div>

          <div className="filter-select-group">
            <span className="filter-label">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="residential">Residential</option>
              <option value="condo">Condo</option>
              <option value="hdb">HDB</option>
              <option value="landed">Landed</option>
              <option value="commercial">Commercial</option>
              <option value="interior design">Interior Design</option>
              <option value="architecture">Architecture</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Table / Grid */}
      <div className="projects-table-container">
        {loading ? (
          <div className="admin-table-loading">Loading projects from database...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="admin-empty-state">
            <p>No projects found matching the specified filters.</p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
                className="btn btn-outline"
                style={{ marginTop: '1rem' }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="projects-grid-list">
            {filteredProjects.map((project) => (
              <article key={project.id} className="project-manage-card">
                <div className="manage-card-media">
                  <img src={project.coverImage} alt={project.title} />
                  <div className="manage-badges-overlay">
                    <span className={`status-pill ${project.status}`}>
                      {project.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    {project.featured && (
                      <span className="featured-pill">Featured</span>
                    )}
                  </div>
                </div>

                <div className="manage-card-body">
                  <div className="manage-card-meta">
                    <span className="manage-cat">
                      <Layers size={13} /> {project.category}
                    </span>
                    {project.location && (
                      <span className="manage-loc">
                        <MapPin size={13} /> {project.location}
                      </span>
                    )}
                    <span className="manage-year">{project.year}</span>
                  </div>

                  <h3 className="manage-card-title">{project.title}</h3>
                  <p className="manage-card-slug">/projects/{project.slug}</p>
                  <p className="manage-card-desc">
                    {project.shortDescription || project.description}
                  </p>

                  <div className="manage-card-actions">
                    {/* Toggle Publish button */}
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(project.id, project.status)}
                      className={`action-btn ${
                        project.status === 'published' ? 'btn-unpublish' : 'btn-publish'
                      }`}
                      title={
                        project.status === 'published'
                          ? 'Unpublish and save as draft'
                          : 'Publish project live'
                      }
                    >
                      {project.status === 'published' ? (
                        <>
                          <EyeOff size={14} />
                          <span>Unpublish</span>
                        </>
                      ) : (
                        <>
                          <Eye size={14} />
                          <span>Publish</span>
                        </>
                      )}
                    </button>

                    {/* Toggle Featured */}
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(project.id)}
                      className={`action-icon-btn ${project.featured ? 'featured' : ''}`}
                      title={project.featured ? 'Remove from featured' : 'Mark as featured'}
                      aria-label="Toggle featured"
                    >
                      <Star
                        size={16}
                        fill={project.featured ? 'var(--color-accent)' : 'none'}
                      />
                    </button>

                    {/* Edit button */}
                    <Link
                      to={`/admin/projects/edit/${project.id}`}
                      className="action-icon-btn"
                      title="Edit project"
                      aria-label="Edit project"
                    >
                      <Edit3 size={16} />
                    </Link>

                    {/* View Public Page Link */}
                    {project.status === 'published' && (
                      <Link
                        to={`/projects/${project.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-icon-btn"
                        title="View public live page"
                        aria-label="View public page"
                      >
                        <ExternalLink size={16} />
                      </Link>
                    )}

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => setDeleteModalTarget(project)}
                      className="action-icon-btn delete"
                      title="Delete project"
                      aria-label="Delete project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal Before Deleting */}
      {deleteModalTarget && (
        <div className="admin-modal-backdrop" onClick={() => setDeleteModalTarget(null)}>
          <div
            className="admin-confirm-dialog"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
          >
            <div className="confirm-icon-box">
              <AlertTriangle size={32} />
            </div>

            <h3 className="confirm-title">Are you sure you want to delete this project?</h3>
            <p className="confirm-desc">
              You are about to permanently remove{' '}
              <strong>"{deleteModalTarget.title}"</strong>. This will remove the project
              from both the admin database and the public website portfolio.
            </p>

            <div className="confirm-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setDeleteModalTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger-delete"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
