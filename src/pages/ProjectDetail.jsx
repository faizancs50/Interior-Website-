import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  Calendar,
  Layers,
  User,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import CTA from '../components/CTA/CTA';
import { pageEnter } from '../animations/pageTransitions';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { slug } = useParams();
  const pageRef = useRef(null);
  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    pageEnter(pageRef.current);
    window.scrollTo(0, 0);

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`/api/projects/${slug}`);
        if (!res.ok) {
          throw new Error('This project could not be found or has not yet been published.');
        }
        const data = await res.json();
        setProject(data.project);
        setRelated(data.related || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  const allImages = project
    ? [project.coverImage, ...(project.galleryImages || [])].filter(Boolean)
    : [];

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + allImages.length) % allImages.length);
    }
  };

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % allImages.length);
    }
  };

  if (loading) {
    return (
      <div className="project-detail-loading">
        <div className="admin-loading-spinner" />
        <p className="admin-loading-text">Loading Project Architecture...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-not-found-page">
        <div className="container">
          <span className="eyebrow">PORTFOLIO ARCHIVE</span>
          <h1 className="not-found-title">Project Not Available</h1>
          <p className="not-found-desc">
            {error || 'The requested project could not be found or has been set to draft status.'}
          </p>
          <Link to="/portfolio" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Return to All Works</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="page-project-detail">
      {/* Editorial Header */}
      <section className="project-hero-section">
        <div className="container">
          <Link to="/portfolio" className="project-back-btn">
            <ArrowLeft size={16} />
            <span>All Selected Works</span>
          </Link>

          <div className="project-title-block">
            <div className="project-meta-eyebrow">
              <span className="project-cat-pill">{project.category}</span>
              {project.style && (
                <>
                  <span className="meta-sep">•</span>
                  <span className="project-style-text">{project.style}</span>
                </>
              )}
            </div>

            <h1 className="project-main-title">{project.title}</h1>

            <div className="project-hero-specs-row">
              {project.location && (
                <div className="hero-spec-item">
                  <MapPin size={16} className="spec-icon" />
                  <span>{project.location}</span>
                </div>
              )}
              {project.year && (
                <div className="hero-spec-item">
                  <Calendar size={16} className="spec-icon" />
                  <span>Completed {project.year}</span>
                </div>
              )}
              {project.area && (
                <div className="hero-spec-item">
                  <Layers size={16} className="spec-icon" />
                  <span>{project.area}</span>
                </div>
              )}
              {project.client && (
                <div className="hero-spec-item">
                  <User size={16} className="spec-icon" />
                  <span>Client: {project.client}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Cover Image Spread */}
      <section className="project-cover-spread">
        <div className="container">
          <div
            className="project-cover-frame"
            onClick={() => openLightbox(0)}
            title="Click to view full image"
          >
            <img
              src={project.coverImage}
              alt={project.title}
              className="project-cover-img"
            />
            <div className="cover-expand-badge">
              <Maximize2 size={16} />
              <span>View Fullscreen</span>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative & Specifications Split */}
      <section className="project-narrative-section">
        <div className="container">
          <div className="project-narrative-grid">
            {/* Left: Architectural Story */}
            <div className="project-story-col">
              <span className="eyebrow">DESIGN BRIEF &amp; SPATIAL CONCEPT</span>
              <h2 className="narrative-heading">
                {project.shortDescription || 'Thoughtfully crafted around daily rituals.'}
              </h2>
              <div className="narrative-body-text">
                {project.description ? (
                  project.description.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))
                ) : (
                  <p>
                    Every detail of this residence was calibrated to maximize natural daylight,
                    acoustic serenity, and tactile warmth through custom direct factory joinery.
                  </p>
                )}
              </div>
            </div>

            {/* Right: Specifications Card */}
            <div className="project-specs-card">
              <h3 className="specs-card-title">Project Data</h3>

              <div className="spec-row">
                <span className="spec-k">Property Category</span>
                <span className="spec-v">{project.category}</span>
              </div>
              {project.propertyType && (
                <div className="spec-row">
                  <span className="spec-k">Configuration</span>
                  <span className="spec-v">{project.propertyType}</span>
                </div>
              )}
              {project.location && (
                <div className="spec-row">
                  <span className="spec-k">Location</span>
                  <span className="spec-v">{project.location}</span>
                </div>
              )}
              {project.area && (
                <div className="spec-row">
                  <span className="spec-k">Floor Area</span>
                  <span className="spec-v">{project.area}</span>
                </div>
              )}
              {project.style && (
                <div className="spec-row">
                  <span className="spec-k">Design Aesthetic</span>
                  <span className="spec-v">{project.style}</span>
                </div>
              )}
              <div className="spec-row">
                <span className="spec-k">Year Handed Over</span>
                <span className="spec-v">{project.year}</span>
              </div>
              <div className="spec-row">
                <span className="spec-k">Joinery Fabrication</span>
                <span className="spec-v">CARPENTERS Singapore Factory</span>
              </div>

              <div className="spec-action-box">
                <Link
                  to={`/consultation?style=${encodeURIComponent(project.style || project.category)}`}
                  className="btn btn-accent spec-cta-btn"
                >
                  <span>Book Consultation for this Style</span>
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {project.galleryImages && project.galleryImages.length > 0 && (
        <section className="project-gallery-section">
          <div className="container">
            <div className="gallery-section-header">
              <span className="eyebrow">PHOTOGRAPHIC ANTHOLOGY</span>
              <h2 className="gallery-section-title">Architectural Details &amp; Millwork</h2>
            </div>

            <div className="project-gallery-masonry">
              {project.galleryImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="gallery-frame"
                  onClick={() => openLightbox(idx + 1)}
                  title="Click to expand"
                >
                  <img
                    src={imgUrl}
                    alt={`${project.title} detail ${idx + 1}`}
                    loading="lazy"
                  />
                  <div className="gallery-frame-overlay">
                    <Maximize2 size={20} className="frame-expand-icon" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Projects */}
      {related.length > 0 && (
        <section className="related-projects-section">
          <div className="container">
            <div className="related-header">
              <span className="eyebrow">EXPLORE SIMILAR WORKS</span>
              <h2 className="related-title">Related Residences</h2>
            </div>

            <div className="related-grid">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/projects/${rel.slug}`}
                  className="related-project-card"
                >
                  <div className="related-img-wrap">
                    <img src={rel.coverImage} alt={rel.title} />
                  </div>
                  <div className="related-info">
                    <span className="related-cat">{rel.category}</span>
                    <h3 className="related-name">{rel.title}</h3>
                    <p className="related-loc">{rel.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="lightbox-backdrop" onClick={closeLightbox}>
          <button
            type="button"
            className="lightbox-close-btn"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X size={26} />
          </button>

          <button
            type="button"
            className="lightbox-nav-btn prev"
            onClick={(e) => {
              e.stopPropagation();
              prevLightbox();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={32} />
          </button>

          <div className="lightbox-image-container" onClick={(e) => e.stopPropagation()}>
            <img src={allImages[lightboxIndex]} alt="Expanded view" />
            <div className="lightbox-counter">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          </div>

          <button
            type="button"
            className="lightbox-nav-btn next"
            onClick={(e) => {
              e.stopPropagation();
              nextLightbox();
            }}
            aria-label="Next image"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}

      {/* Consultation CTA */}
      <CTA />
    </div>
  );
};

export default ProjectDetail;
