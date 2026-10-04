import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowUpRight, X, Calendar, MapPin, Maximize2, Layers } from 'lucide-react';
import gsap from 'gsap';
import { projectsData } from '../data/projects';
import CTA from '../components/CTA/CTA';
import { pageEnter } from '../animations/pageTransitions';
import './Portfolio.css';

const PortfolioPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'All';
  
  const [allProjects, setAllProjects] = useState(projectsData);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const gridRef = useRef(null);
  const pageRef = useRef(null);

  const filterOptions = ['All', 'Residential', 'Condo', 'HDB', 'Landed', 'Commercial', 'Architecture', 'Interior Design'];

  // Fetch live published projects from backend API
  useEffect(() => {
    pageEnter(pageRef.current);

    fetch('/api/projects')
      .then((res) => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then((data) => {
        if (data.projects && data.projects.length > 0) {
          setAllProjects(data.projects);
        }
      })
      .catch((err) => {
        console.warn('Falling back to local projectsData:', err);
      });
  }, []);

  // Update activeFilter if search param changes
  useEffect(() => {
    const param = searchParams.get('filter');
    if (param && filterOptions.some((f) => f.toLowerCase() === param.toLowerCase())) {
      setActiveFilter(param);
    }
  }, [searchParams]);

  // Filtered projects
  const filteredProjects = activeFilter === 'All'
    ? allProjects
    : allProjects.filter((p) => {
        if (!p.category) return false;
        const cat = p.category.toLowerCase();
        const filt = activeFilter.toLowerCase();
        if (cat === filt) return true;
        // Group HDB, Condo, Landed under Residential
        if (filt === 'residential' && (cat === 'hdb' || cat === 'condo' || cat === 'landed' || cat === 'residential')) {
          return true;
        }
        return false;
      });

  // GSAP animation on filter change
  const handleFilterChange = (filter) => {
    if (filter === activeFilter || isFiltering) return;
    setIsFiltering(true);
    setSearchParams(filter === 'All' ? {} : { filter });

    if (gridRef.current) {
      gsap.to(gridRef.current.children, {
        opacity: 0,
        y: 20,
        scale: 0.98,
        duration: 0.25,
        stagger: 0.03,
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
        { opacity: 0, y: 25, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          stagger: 0.06,
          ease: 'power3.out'
        }
      );
    }
  }, [activeFilter, allProjects]);

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
            {filterOptions.map((filter) => {
              const count = filter === 'All'
                ? allProjects.length
                : allProjects.filter((p) => {
                    const cat = (p.category || '').toLowerCase();
                    const filt = filter.toLowerCase();
                    if (cat === filt) return true;
                    if (filt === 'residential' && (cat === 'hdb' || cat === 'condo' || cat === 'landed' || cat === 'residential')) {
                      return true;
                    }
                    return false;
                  }).length;

              if (filter !== 'All' && count === 0) return null;

              return (
                <button
                  key={filter}
                  className={`filter-btn ${activeFilter.toLowerCase() === filter.toLowerCase() ? 'active' : ''}`}
                  onClick={() => handleFilterChange(filter)}
                  disabled={isFiltering}
                >
                  <span>{filter}</span>
                  <span className="filter-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="portfolio-grid-section">
        <div className="container">
          <div ref={gridRef} className="portfolio-masonry-grid">
            {filteredProjects.map((project) => {
              const imageSrc = project.coverImage || project.image || '/images/portfolio/project-1.webp';
              const projectLink = `/projects/${project.slug || project.id}`;

              return (
                <article key={project.id} className="portfolio-project-card">
                  <Link to={projectLink} className="project-card-image-box">
                    <img
                      src={imageSrc}
                      alt={project.title}
                      className="project-card-img"
                      loading="lazy"
                    />
                    <div className="project-card-overlay" />
                    <span className="project-pill">{project.category}</span>
                    
                    <div className="project-view-badge">
                      <span>View Project Page</span>
                      <ArrowUpRight size={16} />
                    </div>
                  </Link>

                  <div className="project-card-info">
                    <div className="project-meta-line">
                      <span className="project-location">{project.location}</span>
                      {project.style && (
                        <>
                          <span className="project-dot">•</span>
                          <span className="project-style">{project.style}</span>
                        </>
                      )}
                    </div>

                    <h3 className="project-title-heading">
                      <Link to={projectLink} className="project-title-link">
                        {project.title}
                      </Link>
                    </h3>

                    <p className="project-snippet">
                      {project.shortDescription || project.description}
                    </p>

                    <div className="project-spec-strip">
                      <span className="project-spec-val">
                        {project.propertyType || project.category}
                      </span>
                      {project.area && <span className="project-spec-area">{project.area}</span>}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Modal if needed */}
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
                src={selectedProject.coverImage || selectedProject.image}
                alt={selectedProject.title}
                className="modal-img"
              />
            </div>

            <div className="modal-content-wrapper">
              <span className="modal-category">{selectedProject.category} Residence</span>
              <h2 className="modal-title">{selectedProject.title}</h2>
              <p className="modal-desc">{selectedProject.shortDescription || selectedProject.description}</p>

              <div className="modal-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <Link
                  to={`/projects/${selectedProject.slug || selectedProject.id}`}
                  className="btn btn-primary"
                >
                  <span>Open Full Project Page</span>
                  <ArrowUpRight size={15} />
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="btn btn-outline"
                >
                  Close
                </button>
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
