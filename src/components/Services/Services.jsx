import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { servicesData } from '../../data/services';
import { fadeUp } from '../../animations/scrollAnimations';
import './Services.css';

const Services = () => {
  const [activeService, setActiveService] = useState(servicesData[0]);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    fadeUp(headerRef.current, { trigger: sectionRef.current, y: 35 });
  }, []);

  return (
    <section className="services-section section-dark" ref={sectionRef} id="services-section">
      <div className="container">
        {/* Section Header */}
        <div ref={headerRef} className="services-header-split">
          <div>
            <span className="eyebrow" style={{ color: 'var(--color-accent)' }}>
              CORE CAPABILITIES
            </span>
            <h2 className="services-section-title">Our Expertise</h2>
          </div>
          <div className="services-header-right">
            <p className="services-intro-para">
              From architectural space planning to precision in-house carpentry,
              we orchestrate every dimension of interior transformation under one unified roof.
            </p>
            <Link to="/services" className="btn btn-outline-white services-all-btn">
              <span>View Detailed Services</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Editorial Interactive Vertical List & Preview Layout */}
        <div className="services-interactive-layout">
          {/* Vertical Interactive List */}
          <div className="services-list" role="list">
            {servicesData.map((service, index) => {
              const isSelected = activeService.id === service.id;
              return (
                <Link
                  to="/services"
                  key={service.id}
                  className={`service-list-item ${isSelected ? 'active' : ''}`}
                  onMouseEnter={() => setActiveService(service)}
                  onFocus={() => setActiveService(service)}
                  role="listitem"
                >
                  <div className="service-item-left">
                    <span className="service-number">{service.number}</span>
                    <span className="service-title-text">{service.title}</span>
                  </div>

                  <div className="service-item-right">
                    <span className="service-category-tag">{service.category}</span>
                    <div className="service-arrow-wrapper">
                      <ArrowUpRight size={22} className="service-item-arrow" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Sticky/Fixed Side Image Preview Panel */}
          <div className="services-preview-panel">
            <div className="services-preview-card">
              <div className="services-preview-media">
                <img
                  key={activeService.id}
                  src={activeService.image}
                  alt={activeService.title}
                  className="services-preview-img animate-fade"
                />
                <div className="services-preview-overlay" />
              </div>

              <div className="services-preview-details">
                <span className="services-preview-num">{activeService.number}</span>
                <h3 className="services-preview-heading">{activeService.title}</h3>
                <p className="services-preview-desc">{activeService.shortDescription}</p>

                <div className="services-preview-footer">
                  <span className="services-preview-highlight">
                    {activeService.highlight}
                  </span>
                  <Link to="/services" className="services-preview-link">
                    <span>Explore Specifications</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
