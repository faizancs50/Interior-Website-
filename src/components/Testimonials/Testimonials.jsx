import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import gsap from 'gsap';
import { testimonialsData } from '../../data/testimonials';
import { fadeUp } from '../../animations/scrollAnimations';
import './Testimonials.css';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const slideRef = useRef(null);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  const total = testimonialsData.length;
  const current = testimonialsData[currentIndex];

  useEffect(() => {
    fadeUp(headerRef.current, { trigger: sectionRef.current, y: 30 });
  }, []);

  const changeSlide = (newIndex) => {
    if (isAnimating || newIndex === currentIndex) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(newIndex);
        setIsAnimating(false);
      }
    });

    tl.to(slideRef.current, {
      opacity: 0,
      y: -15,
      duration: 0.3,
      ease: 'power2.in'
    }).add(() => {
      // Reposition before entering
      gsap.set(slideRef.current, { y: 20, opacity: 0 });
    });
  };

  useEffect(() => {
    if (slideRef.current) {
      gsap.to(slideRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power3.out'
      });
    }
  }, [currentIndex]);

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + total) % total;
    changeSlide(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % total;
    changeSlide(nextIdx);
  };

  return (
    <section className="testimonials-section" ref={sectionRef} id="testimonials-section">
      <div className="container">
        {/* Header */}
        <div ref={headerRef} className="testimonials-header">
          <span className="eyebrow">CLIENT TESTIMONIALS</span>
          <h2 className="testimonials-title">Stories of Distinction</h2>
        </div>

        {/* Testimonial Stage */}
        <div className="testimonial-stage">
          <div className="testimonial-quote-icon">
            <Quote size={52} strokeWidth={1} />
          </div>

          <div ref={slideRef} className="testimonial-slide">
            <div className="testimonial-stars">
              {[...Array(current.rating || 5)].map((_, i) => (
                <Star key={i} size={15} fill="var(--color-accent)" stroke="none" />
              ))}
            </div>

            <blockquote className="testimonial-quote-text">
              "{current.quote}"
            </blockquote>

            <div className="testimonial-author-meta">
              <span className="testimonial-author-name">{current.author}</span>
              <div className="testimonial-details-line">
                <span className="testimonial-proj-type">{current.projectType}</span>
                <span className="testimonial-dot">•</span>
                <span className="testimonial-loc">{current.location}</span>
                <span className="testimonial-dot">•</span>
                <span className="testimonial-year">{current.year}</span>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="testimonial-controls">
            <div className="testimonial-nav-buttons">
              <button
                onClick={handlePrev}
                className="testimonial-nav-btn"
                aria-label="Previous testimonial"
                disabled={isAnimating}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="testimonial-nav-btn"
                aria-label="Next testimonial"
                disabled={isAnimating}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Progress Bar / Dots */}
            <div className="testimonial-pagination">
              {testimonialsData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => changeSlide(idx)}
                  className={`testimonial-dot-btn ${
                    currentIndex === idx ? 'active' : ''
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="testimonial-counter">
              <span>0{currentIndex + 1}</span>
              <span className="counter-sep">/</span>
              <span>0{total}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
