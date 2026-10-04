import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { projectsData } from '../../data/projects';
import { staggerFadeUp } from '../../animations/scrollAnimations';
import './Portfolio.css';

const Portfolio = () => {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  // Curated 4 featured projects for the Home section
  const featuredProjects = projectsData.slice(0, 4);

  useEffect(() => {
    if (itemsRef.current.length > 0) {
      staggerFadeUp(itemsRef.current, {
        trigger: sectionRef.current,
        stagger: 0.2,
        y: 45
      });
    }
  }, []);

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
          {featuredProjects.map((project, index) => {
            const isWide = index === 0 || index === 3;
            return (
              <div
                key={project.id}
                ref={(el) => (itemsRef.current[index] = el)}
                className={`portfolio-card ${isWide ? 'card-wide' : 'card-standard'}`}
              >
                <div className="portfolio-media-wrapper">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="portfolio-card-img"
                    loading="lazy"
                  />
                  <div className="portfolio-card-overlay" />
                  
                  {/* Category Pill */}
                  <span className="portfolio-pill">{project.category}</span>

                  {/* Corner Action Arrow */}
                  <Link
                    to="/portfolio"
                    className="portfolio-action-circle"
                    aria-label={`View ${project.title}`}
                  >
                    <ArrowUpRight size={20} className="portfolio-arrow" />
                  </Link>
                </div>

                <div className="portfolio-card-body">
                  <div className="portfolio-card-meta">
                    <span className="portfolio-loc">{project.location}</span>
                    <span className="portfolio-dot">•</span>
                    <span className="portfolio-style">{project.style}</span>
                  </div>

                  <h3 className="portfolio-card-title">
                    <Link to="/portfolio" className="portfolio-title-link">
                      {project.title}
                    </Link>
                  </h3>

                  <p className="portfolio-card-desc">{project.description}</p>
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
