import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRight, X, Calendar, MapPin, Maximize2, Layers } from 'lucide-react';
import gsap from 'gsap';
import { projectsData } from '../data/projects';
import CTA from '../components/CTA/CTA';
import { pageEnter } from '../animations/pageTransitions';
import './Portfolio.css';

const PortfolioPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'All';
  
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const gridRef = useRef(null);
  const pageRef = useRef(null);

  const filterOptions = ['All', 'HDB', 'Condo', 'Landed', 'Commercial'];

  useEffect(() => {
    pageEnter(pageRef.current);
  }, []);

  // Update activeFilter if search param changes
  useEffect(() => {
    const param = searchParams.get('filter');
    if (param && filterOptions.includes(param)) {
      setActiveFilter(param);
    }
  }, [searchParams]);

  // Filtered projects
  const filteredProjects = activeFilter === 'All'
    ? projectsData
    : projectsData.filter((p) => p.category === activeFilter);

  // GSAP animation on filter change
  const handleFilterChange = (filter) => {
    if (filter === activeFilter || isFiltering) return;
    setIsFiltering(true);
    setSearchParams(filter === 'All' ? {} : { filter });

    if (gridRef.current) {
      // Animate existing items out
      gsap.to(gridRef.current.children, {
        opacity: 0,
        y: 20,
        scale: 0.98,
        duration: 0.28,
        stagger: 0.04,
        ease: 'power2.in',
        onComplete: () => {
          setActiveFilter(filter);
          setIsFiltering(false);
        }
      });
    } else {
      setActiveFilter(filter);
      setIsFiltering(false);
    }
  };

  // Animate items in when activeFilter updates
  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out'
        }
      );
    }
  }, [activeFilter]);

  return (
    <div ref={pageRef} className="page-portfolio">
      {/* Page Header */}
      <section className="portfolio-page-hero">
        <div className="container">
          <span className="eyebrow">PORTFOLIO ARCHIVE</span>
          <h1 className="portfolio-page-title">
            Curated Residences &amp; Spaces.
          </h1>
          <p className="portfolio-page-lead">
            Explore our anthology of completed homes across Singapore, each thoughtfully
            tailored to personal routines, architectural context, and timeless materiality.
          </p>

          {/* Filter Bar */}
          <div className="portfolio-filter-bar">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => handleFilterChange(filter)}
                disabled={isFiltering}
              >
                <span>{filter}</span>
                <span className="filter-count">
                  {filter === 'All'
                    ? projectsData.length
                    : projectsData.filter((p) => p.category === filter).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="portfolio-grid-section">
        <div className="container">
          <div ref={gridRef} className="portfolio-masonry-grid">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="portfolio-project-card"
                onClick={() => setSelectedProject(project)}
              >
                <div className="project-card-image-box">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="project-card-img"
                    loading="lazy"
                  />
                  <div className="project-card-overlay" />
                  <span className="project-pill">{project.category}</span>
                  
                  <div className="project-view-badge">
                    <span>View Project</span>
                    <ArrowUpRight size={16} />
                  </div>
                </div>

                <div className="project-card-info">
                  <div className="project-meta-line">
                    <span className="project-location">{project.location}</span>
                    <span className="project-dot">•</span>
                    <span className="project-style">{project.style}</span>
                  </div>

                  <h3 className="project-title-heading">{project.title}</h3>
                  <p className="project-snippet">{project.description}</p>

                  <div className="project-spec-strip">
                    <span className="project-spec-val">{project.propertyType}</span>
                    <span className="project-spec-area">{project.area}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Project Details Modal */}
      {selectedProject && (
        <div
          className="project-modal-backdrop"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="project-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setSelectedProject(null)}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <div className="modal-image-wrapper">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="modal-img"
              />
            </div>

            <div className="modal-content-wrapper">
              <span className="modal-category">{selectedProject.category} Residence</span>
              <h2 className="modal-title">{selectedProject.title}</h2>
              <p className="modal-desc">{selectedProject.description}</p>

              <div className="modal-specs-grid">
                <div className="modal-spec-item">
                  <span className="spec-label">Location</span>
                  <span className="spec-value">{selectedProject.location}</span>
                </div>
                <div className="modal-spec-item">
                  <span className="spec-label">Property Type</span>
                  <span className="spec-value">{selectedProject.propertyType}</span>
                </div>
                <div className="modal-spec-item">
                  <span className="spec-label">Design Style</span>
                  <span className="spec-value">{selectedProject.style}</span>
                </div>
                <div className="modal-spec-item">
                  <span className="spec-label">Floor Area</span>
                  <span className="spec-value">{selectedProject.area}</span>
                </div>
                <div className="modal-spec-item">
                  <span className="spec-label">Completion</span>
                  <span className="spec-value">{selectedProject.year}</span>
                </div>
                <div className="modal-spec-item">
                  <span className="spec-label">Duration</span>
                  <span className="spec-value">{selectedProject.duration}</span>
                </div>
              </div>

              <div className="modal-actions">
                <a
                  href={`/consultation?style=${encodeURIComponent(selectedProject.style)}`}
                  className="btn btn-primary"
                >
                  <span>Inquire About Similar Style</span>
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <CTA />
    </div>
  );
};

export default PortfolioPage;
