import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { parallaxImage } from '../../animations/scrollAnimations';
import './CTA.css';

const CTA = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageRef.current && containerRef.current) {
      parallaxImage(imageRef.current, containerRef.current, 50);
    }
  }, []);

  return (
    <section className="cta-section" ref={containerRef} id="cta-section">
      <div className="cta-media-wrapper">
        <img
          ref={imageRef}
          src="/images/hero/hero-2.webp"
          alt="Luxury Architecture by CARPENTERS"
          className="cta-bg-image"
          loading="lazy"
        />
        <div className="cta-overlay" />
      </div>

      <div className="container cta-container">
        <div className="cta-content">
          <div className="cta-badge">
            <Sparkles size={14} className="cta-sparkle" />
            <span>BEGIN YOUR JOURNEY</span>
          </div>

          <h2 className="cta-heading">
            Let's create a space that feels like yours.
          </h2>

          <p className="cta-subtext">
            Tell us about your home and let our designers help bring your vision to life.
            Complimentary spatial feasibility review and tailored 3D concept overview.
          </p>

          <div className="cta-actions">
            <Link to="/consultation" className="btn btn-accent cta-btn-main">
              <Calendar size={17} />
              <span>Book a Design Consultation</span>
            </Link>
            <Link to="/portfolio" className="btn btn-outline-white cta-btn-secondary">
              <span>View Past Projects</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="cta-perks">
            <span className="cta-perk-item">✓ CaseTrust Escrow Security</span>
            <span className="cta-perk-item">✓ Zero Obligation Floorplan Review</span>
            <span className="cta-perk-item">✓ Direct Factory Carpentry</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
