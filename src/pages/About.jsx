import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Shield, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import CTA from '../components/CTA/CTA';
import { pageEnter } from '../animations/pageTransitions';
import { fadeUp, staggerFadeUp } from '../animations/scrollAnimations';
import './About.css';

const About = () => {
  const pageRef = useRef(null);
  const teamRef = useRef([]);

  useEffect(() => {
    pageEnter(pageRef.current);
    if (teamRef.current.length > 0) {
      staggerFadeUp(teamRef.current, { stagger: 0.15, y: 35 });
    }
  }, []);

  const team = [
    {
      name: 'Julian Tan',
      role: 'Founding Principal & Design Director',
      bio: 'Over 18 years shaping residential architecture in Singapore and Milan, championing tactile minimalism and spatial harmony.',
      image: '/images/residences/condo-1.webp'
    },
    {
      name: 'Rachel Wong',
      role: 'Head of Architectural Interiors',
      bio: 'B.Arch honours graduate specializing in adaptive re-use, double-volume spatial zoning, and seamless indoor-outdoor transitions.',
      image: '/images/portfolio/project-4.webp'
    },
    {
      name: 'Master Joiner Chen',
      role: 'Director of Carpentry & Millwork',
      bio: 'Over 30 years mastering precision joinery, computer-guided CNC fabrication, and high-tolerance bespoke architectural built-ins.',
      image: '/images/services/hdb.webp'
    },
    {
      name: 'David Seah',
      role: 'Head of Construction & Compliance',
      bio: 'BCA-certified project engineer enforcing strict structural safety, acoustic insulation benchmarks, and punctuality across all sites.',
      image: '/images/services/landed.webp'
    }
  ];

  const milestones = [
    { year: '2010', event: 'Inception as a dedicated artisanal woodworking studio in Singapore.' },
    { year: '2014', event: 'Expanded to full-scale turnkey design and build with CaseTrust RCMA joint accreditation.' },
    { year: '2018', event: 'Commissioned our direct 15,000 sqft automated woodworking factory with CNC precision.' },
    { year: '2022', event: 'Surpassed 10,000 completed residential handovers with bizSAFE STAR certification.' },
    { year: 'Present', event: 'Over 13,000 homes transformed with a team of 35+ visionary design architects.' }
  ];

  return (
    <div ref={pageRef} className="page-about">
      {/* Editorial Page Hero */}
      <section className="about-hero">
        <div className="container">
          <span className="eyebrow">ABOUT CARPENTERS</span>
          <h1 className="about-hero-title">
            Architecture of Living.
            <br />
            Precision of Craft.
          </h1>
          <p className="about-hero-lead">
            Founded on the conviction that honest materials and master craftsmanship
            form the foundation of peaceful, enduring homes.
          </p>
        </div>
      </section>

      {/* Full-width Image Spread */}
      <section className="about-image-spread">
        <div className="container">
          <div className="about-spread-frame">
            <img
              src="/images/hero/hero-1.webp"
              alt="CARPENTERS Design Atelier"
              className="about-spread-img"
            />
            <div className="about-spread-caption">
              <span>SINGAPORE DESIGN GALLERY &amp; DIRECT FACTORY SHOWCASE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="about-story-section section">
        <div className="container">
          <div className="about-story-grid">
            <div className="about-story-left">
              <span className="eyebrow">OUR HERITAGE</span>
              <h2 className="section-title">
                From a bespoke joinery bench to Singapore's trusted design authority.
              </h2>
            </div>
            <div className="about-story-right">
              <p className="about-text-lead">
                Unlike marketing agencies that outsource construction to subcontractors,
                CARPENTERS was born at the workbench. We began as master joiners who understood
                the grain of timber, the weight of stone, and the tolerance of steel.
              </p>
              <p className="about-text-body">
                Over the past 15 years, that tactile discipline evolved into a comprehensive
                design practice. Today, our 35+ architects and designers work hand-in-hand
                with our own manufacturing factory, ensuring that what is rendered in 3D
                is executed with uncompromising precision on site.
              </p>

              {/* Milestones timeline */}
              <div className="about-milestones">
                <h4 className="milestones-heading">Key Milestones</h4>
                <div className="milestones-list">
                  {milestones.map((m, i) => (
                    <div key={i} className="milestone-item">
                      <span className="milestone-year">{m.year}</span>
                      <p className="milestone-event">{m.event}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Philosophy Split */}
      <section className="about-philosophy-section section-dark">
        <div className="container">
          <div className="philosophy-header">
            <span className="eyebrow" style={{ color: 'var(--color-accent)' }}>
              PHILOSOPHY
            </span>
            <h2 className="philosophy-title">Our Four Architectural Pillars</h2>
          </div>

          <div className="philosophy-grid">
            <div className="philosophy-card">
              <span className="pillar-num">01</span>
              <h3 className="pillar-title">Spatial Proportions</h3>
              <p className="pillar-desc">
                We believe layout precedes finish. Before choosing colors or stone,
                we optimize sightlines, acoustic buffers, and natural sunlight paths
                to create effortlessly fluid environments.
              </p>
            </div>

            <div className="philosophy-card">
              <span className="pillar-num">02</span>
              <h3 className="pillar-title">Tactile Materiality</h3>
              <p className="pillar-desc">
                We celebrate materials that age with grace: natural travertine,
                quarter-sawn walnut, hand-troweled microcement, and brushed bronze
                fixtures that feel grounding to touch.
              </p>
            </div>

            <div className="philosophy-card">
              <span className="pillar-num">03</span>
              <h3 className="pillar-title">Direct Joinery</h3>
              <p className="pillar-desc">
                Operating our own Singapore woodworking facility allows us to control
                every dovetail joint, flush reveal, and concealed pocket door with
                millimeter tolerances impossible with third-party outsourcing.
              </p>
            </div>

            <div className="philosophy-card">
              <span className="pillar-num">04</span>
              <h3 className="pillar-title">Contractual Rigour</h3>
              <p className="pillar-desc">
                Dual-accredited by CaseTrust and BCA with 100% deposit escrow security.
                We provide itemized quotations and punctual handovers backed by
                lifetime mechanical hardware warranties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="about-team-section section" id="team">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">LEADERSHIP</span>
            <h2 className="section-title">The Minds Behind Every Space</h2>
            <p className="section-desc">
              A collaborative collective of spatial architects, interior designers,
              master craftsmen, and site directors.
            </p>
          </div>

          <div className="team-grid">
            {team.map((member, idx) => (
              <div
                key={idx}
                ref={(el) => (teamRef.current[idx] = el)}
                className="team-card"
              >
                <div className="team-image-box">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="team-img"
                    loading="lazy"
                  />
                  <div className="team-overlay" />
                </div>
                <div className="team-info">
                  <h3 className="team-name">{member.name}</h3>
                  <span className="team-role">{member.role}</span>
                  <p className="team-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Component */}
      <CTA />
    </div>
  );
};

export default About;
