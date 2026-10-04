import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  X,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Save,
  Eye,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminProjectForm.css';

const AdminProjectForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Residential',
    location: '',
    propertyType: '',
    style: '',
    year: new Date().getFullYear().toString(),
    client: '',
    area: '',
    shortDescription: '',
    description: '',
    coverImage: '',
    galleryImages: [],
    featured: false,
    status: 'published'
  });

  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // If edit mode, fetch current project data
  useEffect(() => {
    if (!isEditMode) return;

    const loadProject = async () => {
      try {
        setInitialLoading(true);
        const res = await fetch(`/api/projects/admin/detail/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Project not found in database.');
        const data = await res.json();
        const p = data.project;
        setFormData({
          title: p.title || '',
          slug: p.slug || '',
          category: p.category || 'Residential',
          location: p.location || '',
          propertyType: p.propertyType || '',
          style: p.style || '',
          year: p.year || '',
          client: p.client || '',
          area: p.area || '',
          shortDescription: p.shortDescription || '',
          description: p.description || '',
          coverImage: p.coverImage || '',
          galleryImages: Array.isArray(p.galleryImages) ? p.galleryImages : [],
          featured: Boolean(p.featured),
          status: p.status || 'published'
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setInitialLoading(false);
      }
    };

    loadProject();
  }, [id, isEditMode, token]);

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: val };
      // Auto generate slug if title changed and slug wasn't manually altered
      if (name === 'title' && !isEditMode) {
        updated.slug = value
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      return updated;
    });
  };

  // Upload Cover Image
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      setUploadingCover(true);
      setError('');
      const res = await fetch('/api/upload/single', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload cover image.');
      setFormData((prev) => ({ ...prev, coverImage: data.url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  // Upload Multiple Gallery Images
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const uploadData = new FormData();
    files.forEach((file) => uploadData.append('images', file));

    try {
      setUploadingGallery(true);
      setError('');
      const res = await fetch('/api/upload/multiple', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload gallery images.');

      setFormData((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...data.urls]
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingGallery(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  // Remove gallery image
  const removeGalleryImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Move gallery image up/down
  const moveGalleryImage = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.galleryImages.length) return;

    const updated = [...formData.galleryImages];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    setFormData((prev) => ({ ...prev, galleryImages: updated }));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.title.trim()) {
      setError('Please provide a project title.');
      return;
    }

    if (!formData.coverImage) {
      setError('Please upload or select a cover image for the project.');
      return;
    }

    setIsSubmitting(true);

    try {
      const url = isEditMode
        ? `/api/projects/admin/${id}`
        : '/api/projects/admin';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save project.');

      setSuccessMsg(
        isEditMode
          ? 'Project updated successfully.'
          : 'Project added successfully.'
      );

      setTimeout(() => {
        navigate('/admin/projects');
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-spinner" />
        <p className="admin-loading-text">Loading Project Details...</p>
      </div>
    );
  }

  return (
    <div className="admin-project-form-page">
      {/* Top Header */}
      <div className="form-header-bar">
        <Link to="/admin/projects" className="form-back-link">
          <ArrowLeft size={16} />
          <span>Back to Projects</span>
        </Link>

        <h1 className="form-page-title">
          {isEditMode ? `Edit: ${formData.title}` : 'Add New Project'}
        </h1>
        <p className="form-page-sub">
          {isEditMode
            ? 'Update project specifications, imagery, and publication settings.'
            : 'Enter architecture specifications, upload high-resolution images, and publish live.'}
        </p>
      </div>

      {error && (
        <div className="admin-error-notice" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="admin-success-notice" role="status">
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="project-editor-form">
        <div className="form-two-column-layout">
          {/* Main Info Column */}
          <div className="form-main-col">
            <div className="form-card-section">
              <h3 className="card-section-title">Core Information</h3>

              <div className="form-group">
                <label className="form-label" htmlFor="proj-title">
                  Project Title <span className="req">*</span>
                </label>
                <input
                  type="text"
                  id="proj-title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Minimalist Urban Sanctuary"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="proj-slug">
                    Clean URL Slug <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    id="proj-slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="e.g. minimalist-urban-sanctuary"
                    className="form-input"
                    required
                  />
                  <span className="form-hint">Public URL: /projects/{formData.slug || 'slug'}</span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="proj-cat">
                    Project Category <span className="req">*</span>
                  </label>
                  <select
                    id="proj-cat"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Interior Design">Interior Design</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Condo">Condominium</option>
                    <option value="HDB">HDB / BTO</option>
                    <option value="Landed">Landed Estate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="proj-loc">
                    Location
                  </label>
                  <input
                    type="text"
                    id="proj-loc"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Marina One Residences, Singapore"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="proj-year">
                    Project Year
                  </label>
                  <input
                    type="text"
                    id="proj-year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="2025"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="proj-client">
                    Client Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="proj-client"
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    placeholder="e.g. Private Owner / The Tan Family"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="proj-area">
                    Floor Area (Optional)
                  </label>
                  <input
                    type="text"
                    id="proj-area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g. 1,850 sqft"
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div className="form-card-section">
              <h3 className="card-section-title">Narrative &amp; Architectural Concept</h3>

              <div className="form-group">
                <label className="form-label" htmlFor="proj-short-desc">
                  Short Summary (Shown on Cards)
                </label>
                <textarea
                  id="proj-short-desc"
                  name="shortDescription"
                  rows="2"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  placeholder="Concise 1-2 sentence overview highlighting spatial quality..."
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="proj-desc">
                  Detailed Description
                </label>
                <textarea
                  id="proj-desc"
                  name="description"
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Comprehensive description of the layout reconfiguration, material selection, bespoke carpentry, lighting architecture, and lifestyle design..."
                  className="form-textarea"
                />
              </div>
            </div>

            {/* Gallery Images */}
            <div className="form-card-section">
              <div className="gallery-header-row">
                <div>
                  <h3 className="card-section-title">Project Gallery Images</h3>
                  <p className="section-hint-text">
                    Upload multiple high-resolution photos for the project gallery. Reorder or remove images as needed.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="btn btn-outline upload-btn"
                  disabled={uploadingGallery}
                >
                  <Upload size={14} />
                  <span>{uploadingGallery ? 'Uploading...' : 'Upload Images'}</span>
                </button>
                <input
                  type="file"
                  ref={galleryInputRef}
                  onChange={handleGalleryUpload}
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  style={{ display: 'none' }}
                />
              </div>

              {formData.galleryImages.length === 0 ? (
                <div
                  className="empty-gallery-dropzone"
                  onClick={() => galleryInputRef.current?.click()}
                >
                  <ImageIcon size={36} className="empty-gallery-icon" />
                  <p className="dropzone-text">No gallery images added yet</p>
                  <span className="dropzone-sub">
                    Click here to select multiple JPG, PNG, or WebP files
                  </span>
                </div>
              ) : (
                <div className="gallery-previews-grid">
                  {formData.galleryImages.map((imgUrl, idx) => (
                    <div key={idx} className="gallery-item-card">
                      <div className="gallery-item-img-wrap">
                        <img src={imgUrl} alt={`Gallery ${idx + 1}`} />
                        <span className="gallery-index-badge">{idx + 1}</span>
                      </div>

                      <div className="gallery-item-actions">
                        <button
                          type="button"
                          onClick={() => moveGalleryImage(idx, 'up')}
                          disabled={idx === 0}
                          className="gallery-nav-btn"
                          title="Move left/up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveGalleryImage(idx, 'down')}
                          disabled={idx === formData.galleryImages.length - 1}
                          className="gallery-nav-btn"
                          title="Move right/down"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="gallery-remove-btn"
                          title="Remove image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Settings & Cover Image Sidebar Column */}
          <div className="form-side-col">
            {/* Publish & Status Card */}
            <div className="form-card-section side-card">
              <h3 className="card-section-title">Publishing &amp; Visibility</h3>

              <div className="form-group">
                <label className="form-label">Publication Status</label>
                <div className="status-radio-options">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={formData.status === 'published'}
                      onChange={handleChange}
                    />
                    <div className="radio-info">
                      <span className="radio-title">Published</span>
                      <span className="radio-desc">Visible on public portfolio immediately</span>
                    </div>
                  </label>

                  <label className="radio-label">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={formData.status === 'draft'}
                      onChange={handleChange}
                    />
                    <div className="radio-info">
                      <span className="radio-title">Draft</span>
                      <span className="radio-desc">Private; only visible to admins</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                  <span>Mark as Featured Project on Homepage</span>
                </label>
              </div>

              <div className="form-save-actions">
                <button
                  type="submit"
                  className="btn btn-primary form-submit-btn"
                  disabled={isSubmitting}
                >
                  <Save size={16} />
                  <span>{isSubmitting ? 'Saving Project...' : isEditMode ? 'Update Project' : 'Publish Project'}</span>
                </button>
              </div>
            </div>

            {/* Cover Image Card */}
            <div className="form-card-section side-card">
              <div className="cover-header">
                <h3 className="card-section-title">Cover Image</h3>
                <span className="req">*</span>
              </div>
              <p className="section-hint-text">
                Primary image shown on the portfolio index and hero cards.
              </p>

              {formData.coverImage ? (
                <div className="cover-preview-box">
                  <img src={formData.coverImage} alt="Cover Preview" />
                  <div className="cover-preview-overlay">
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className="btn btn-outline-white change-cover-btn"
                      disabled={uploadingCover}
                    >
                      <Upload size={14} />
                      <span>{uploadingCover ? 'Uploading...' : 'Replace Cover'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="empty-cover-box"
                  onClick={() => coverInputRef.current?.click()}
                >
                  <Upload size={28} className="upload-icon" />
                  <p className="dropzone-text">Click to Upload Cover Image</p>
                  <span className="dropzone-sub">JPG, PNG, or WebP up to 15MB</span>
                </div>
              )}

              <input
                type="file"
                ref={coverInputRef}
                onChange={handleCoverUpload}
                accept="image/jpeg,image/png,image/webp,image/avif"
                style={{ display: 'none' }}
              />

              {/* Or manual URL fallback */}
              <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label className="form-label" htmlFor="cover-url">
                  Or enter image URL path:
                </label>
                <input
                  type="text"
                  id="cover-url"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="/images/portfolio/project-1.webp"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminProjectForm;
