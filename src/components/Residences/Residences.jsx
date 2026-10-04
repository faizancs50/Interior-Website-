import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { staggerFadeUp } from '../../animations/scrollAnimations';
import './Residences.css';

const Residences = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (cardsRef.current.length > 0) {
      staggerFadeUp(cardsRef.current, {
        trigger: sectionRef.current,
        stagger: 0.18,
        y: 45
      });
    }
  }, []);

  const residences = [
    {
      id: 'hdb',
      category: 'HDB & BTO Flats',
      title: 'HDB Residences',
      description:
        'Transforming standard spatial footprints into serene, expansive, architectural homes with ingenious built-in joinery.',
      image: '/images/residences/hdb-1.webp',
      link: '/portfolio?filter=HDB',
      tag: 'BTO & Resale'
    },
    {
      id: 'condo',
      category: 'Private Condominiums',
      title: 'Condominium Living',
      description:
        'Refined private residences curated with imported stone, fluted paneling, and intelligent architectural illumination.',
      image: '/images/residences/condo-1.webp',
      link: '/portfolio?filter=Condo',
      tag: 'Luxury Apartments'
    },
    {
      id: 'landed',
      category: 'Landed Estates',
      title: 'Landed Architecture',
      description:
        'Monumental scale balanced with intimate warmth across multi-storey bungalows, semi-detached, and terrace homes.',
      image: '/images/residences/landed-1.webp',
      link: '/portfolio?filter=Landed',
      tag: 'Detached & Semi-D'
    }
  ];

  return (
    <section className="residences-section" ref={sectionRef} id="residences-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header residences-header">
          <span className="eyebrow">RESIDENTIAL PORTFOLIO</span>
          <div className="residences-header-row">
            <h2 className="section-title">
              Designed for Every Kind of Home
            </h2>
            <Link to="/portfolio" className="btn-link residences-all-link">
              <span>View All Residential Works</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {/* 3 Large Image Cards */}
        <div className="residences-grid">
          {residences.map((res, index) => (
            <Link
              to={res.link}
              key={res.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="residence-card"
            >
              <div className="residence-image-wrap">
                <img
                  src={res.image}
                  alt={res.title}
                  className="residence-image"
                  loading="lazy"
                />
                <div className="residence-overlay" />
                <span className="residence-badge">{res.tag}</span>
              </div>

              <div className="residence-content">
                <div className="residence-meta">
                  <span className="residence-category">{res.category}</span>
                  <div className="residence-arrow-box">
                    <ArrowUpRight size={20} className="residence-arrow-icon" />
                  </div>
                </div>

                <h3 className="residence-title">{res.title}</h3>
                <p className="residence-desc">{res.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Residences;
