import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { servicesData } from '../data/services';
import CTA from '../components/CTA/CTA';
import { pageEnter } from '../animations/pageTransitions';
import { staggerFadeUp } from '../animations/scrollAnimations';
import './Services.css';

const ServicesPage = () => {
  const pageRef = useRef(null);
  const serviceCardsRef = useRef([]);

  useEffect(() => {
    pageEnter(pageRef.current);
    if (serviceCardsRef.current.length > 0) {
      staggerFadeUp(serviceCardsRef.current, {
        stagger: 0.15,
        y: 40
      });
    }
  }, []);

  return (
    <div ref={pageRef} className="page-services">
      {/* Page Hero */}
      <section className="services-hero">
        <div className="container">
          <span className="eyebrow">OUR CAPABILITIES</span>
          <h1 className="services-hero-title">
            Comprehensive Design
            <br />
            &amp; Build Solutions.
          </h1>
          <p className="services-hero-lead">
            From preliminary spatial reconfiguration to bespoke in-house joinery,
            we manage the entire spectrum of residential and commercial renovation
            with meticulous Singapore craftsmanship.
          </p>
        </div>
      </section>

      {/* Services List Section */}
      <section className="services-detailed-section">
        <div className="container">
          <div className="services-detailed-list">
            {servicesData.map((service, index) => {
              const isEven = index % 2 === 1;
              return (
                <div
                  key={service.id}
                  id={service.id}
                  ref={(el) => (serviceCardsRef.current[index] = el)}
                  className={`service-detail-row ${isEven ? 'row-reversed' : ''}`}
                >
                  {/* Image Column */}
                  <div className="service-detail-media">
                    <div className="service-detail-img-wrap">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="service-detail-img"
                        loading="lazy"
                      />
                      <div className="service-detail-img-overlay" />
                    </div>
                    <div className="service-highlight-tag">
                      <Sparkles size={13} className="service-sparkle" />
                      <span>{service.highlight}</span>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="service-detail-content">
                    <div className="service-meta-top">
                      <span className="service-detail-num">{service.number}</span>
                      <span className="service-detail-cat">{service.category}</span>
                    </div>

                    <h2 className="service-detail-title">{service.title}</h2>
                    <p className="service-detail-desc">{service.description}</p>

                    <div className="service-features-box">
                      <h4 className="features-heading">Scope &amp; Deliverables</h4>
                      <ul className="service-features-list">
                        {service.features.map((feat, fIdx) => (
                          <li key={fIdx} className="feature-item">
                            <div className="feature-check-icon">
                              <Check size={14} />
                            </div>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="service-cta-row">
                      <Link
                        to={`/consultation?service=${service.id}`}
                        className="btn btn-primary"
                      >
                        <span>Request {service.title} Quote</span>
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTA />
    </div>
  );
};

export default ServicesPage;
