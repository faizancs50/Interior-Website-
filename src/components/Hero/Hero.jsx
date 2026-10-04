import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { animateHero } from '../../animations/heroAnimations';
import './Hero.css';

const Hero = () => {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingLine1Ref = useRef(null);
  const headingLine2Ref = useRef(null);
  const headingLine3Ref = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);
  const metaRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const headingLines = [
      headingLine1Ref.current,
      headingLine2Ref.current,
      headingLine3Ref.current
    ];

    const tl = animateHero({
      imageRef,
      eyebrowRef,
      headingLinesRef: { current: headingLines },
      descRef,
      buttonsRef,
      metaRef
    });

    // Subtle continuous ambient pan / float effect on background image
    const ambientTween = gsap.to(imageRef.current, {
      scale: 1.05,
      y: -15,
      duration: 18,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Scroll indicator bounce / pulse
    const scrollTween = gsap.to(scrollIndicatorRef.current, {
      y: 6,
      opacity: 0.6,
      duration: 1.4,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    return () => {
      tl.kill();
      ambientTween.kill();
      scrollTween.kill();
    };
  }, []);

  const handleScrollDown = () => {
    const nextSection = document.getElementById('intro-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" ref={heroRef} id="hero-section">
      {/* Background Image Container */}
      <div className="hero-media-wrapper">
        <img
          ref={imageRef}
          src="/images/hero/hero-1.webp"
          alt="Luxury Architectural Living by CARPENTERS"
          className="hero-image"
          fetchPriority="high"
        />
        <div className="hero-overlay" />
        <div className="hero-vignette" />
      </div>

      {/* Main Content */}
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-eyebrow-wrap">
            <span ref={eyebrowRef} className="hero-eyebrow">
              INTERIOR DESIGN &amp; RENOVATION
            </span>
          </div>

          <h1 className="hero-heading">
            <span className="hero-heading-line">
              <span ref={headingLine1Ref} className="hero-line-inner">
                Rajabul.
              </span>
            </span>
            <span className="hero-heading-line">
              <span ref={headingLine2Ref} className="hero-line-inner">
                Craft.
              </span>
            </span>
            <span className="hero-heading-line">
              <span ref={headingLine3Ref} className="hero-line-inner">
                Distinction.
              </span>
            </span>
          </h1>

          <p ref={descRef} className="hero-desc">
            Thoughtfully designed interiors crafted around the way you live.
          </p>

          <div ref={buttonsRef} className="hero-buttons">
            <Link to="/portfolio" className="btn btn-outline-white hero-btn-secondary">
              <span>Explore Our Work</span>
              <ArrowUpRight size={16} />
            </Link>
            <Link to="/consultation" className="btn btn-accent hero-btn-primary">
              <span>Book a Consultation</span>
            </Link>
          </div>
        </div>

        {/* Hero Bottom Bar / Metadata */}
        <div ref={metaRef} className="hero-footer-bar">
          <div className="hero-meta-item">
            <span className="hero-meta-label">Accreditation</span>
            <span className="hero-meta-val">CaseTrust &amp; BCA Registered</span>
          </div>
          <div className="hero-meta-item">
            <span className="hero-meta-label">Direct Facility</span>
            <span className="hero-meta-val">In-House Woodworking Factory</span>
          </div>
          <div className="hero-meta-item">
            <span className="hero-meta-label">Est. 2010</span>
            <span className="hero-meta-val">13,000+ Completed Homes</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          ref={scrollIndicatorRef}
          onClick={handleScrollDown}
          className="hero-scroll-indicator"
          aria-label="Scroll to introduction"
        >
          <span className="hero-scroll-text">DISCOVER</span>
          <ArrowDown size={14} className="hero-scroll-icon" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
