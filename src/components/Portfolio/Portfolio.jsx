import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { projectsData } from '../../data/projects';
import { staggerFadeUp } from '../../animations/scrollAnimations';
import './Portfolio.css';

const Portfolio = () => {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);
  const [projects, setProjects] = useState(projectsData.slice(0, 4));

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then((data) => {
        if (data.projects && data.projects.length > 0) {
          // Prioritize featured projects first, then take 4
          const sorted = data.projects.slice().sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          setProjects(sorted.slice(0, 4));
        }
      })
      .catch((err) => {
        console.warn('Using default featured projects:', err);
      });
  }, []);

  useEffect(() => {
    if (itemsRef.current.length > 0) {
      staggerFadeUp(itemsRef.current, {
        trigger: sectionRef.current,
        stagger: 0.2,
        y: 45
      });
    }
  }, [projects]);

  return (
    <section className="portfolio-section" ref={sectionRef} id="portfolio-section">
      <div className="container">
        {/* Editorial Section Header */}
        <div className="section-header portfolio-header">
          <div className="portfolio-header-content">
            <span className="eyebrow">CURATED SPACES</span>
            <h2 className="section-title">Selected Works</h2>
            <p className="portfolio-header-lead">
              A curated anthology of private residences shaped with architectural restraint,
              artisanal millwork, and tactile materiality.
            </p>
          </div>

          <div className="portfolio-header-cta">
            <Link to="/portfolio" className="btn btn-outline portfolio-view-all-btn">
              <span>View All Projects</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Editorial Asymmetric Grid */}
        <div className="portfolio-editorial-grid">
          {projects.map((project, index) => {
            const isWide = index === 0 || index === 3;
            const imageSrc = project.coverImage || project.image || '/images/portfolio/project-1.webp';
            const projectLink = `/projects/${project.slug || project.id}`;

            return (
              <div
                key={project.id}
                ref={(el) => (itemsRef.current[index] = el)}
                className={`portfolio-card ${isWide ? 'card-wide' : 'card-standard'}`}
              >
                <div className="portfolio-media-wrapper">
                  <img
                    src={imageSrc}
                    alt={project.title}
                    className="portfolio-card-img"
                    loading="lazy"
                  />
                  <div className="portfolio-card-overlay" />
                  
                  {/* Category Pill */}
                  <span className="portfolio-pill">{project.category}</span>

                  {/* Corner Action Arrow */}
                  <Link
                    to={projectLink}
                    className="portfolio-action-circle"
                    aria-label={`View ${project.title}`}
                  >
                    <ArrowUpRight size={20} className="portfolio-arrow" />
                  </Link>
                </div>

                <div className="portfolio-card-body">
                  <div className="portfolio-card-meta">
                    <span className="portfolio-loc">{project.location}</span>
                    {project.style && (
                      <>
                        <span className="portfolio-dot">•</span>
                        <span className="portfolio-style">{project.style}</span>
                      </>
                    )}
                  </div>

                  <h3 className="portfolio-card-title">
                    <Link to={projectLink} className="portfolio-title-link">
                      {project.title}
                    </Link>
                  </h3>

                  <p className="portfolio-card-desc">
                    {project.shortDescription || project.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Mobile Link */}
        <div className="portfolio-bottom-action">
          <Link to="/portfolio" className="btn btn-primary">
            <span>Explore All Projects</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
