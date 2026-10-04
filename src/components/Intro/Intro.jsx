import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Factory, Award, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fadeUp, staggerFadeUp } from '../../animations/scrollAnimations';
import './Intro.css';

gsap.registerPlugin(ScrollTrigger);

const Intro = () => {
  const introRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const statsRef = useRef(null);
  const whySectionRef = useRef(null);
  const featuresRef = useRef([]);

  useEffect(() => {
    // Left column heading animation
    fadeUp(leftColRef.current, { y: 35, duration: 1.1, trigger: introRef.current });

    // Right column paragraph animation
    fadeUp(rightColRef.current, { y: 35, duration: 1.1, delay: 0.2, trigger: introRef.current });

    // Stats counter & stagger animation
    if (statsRef.current) {
      const statItems = statsRef.current.querySelectorAll('.stat-item');
      gsap.fromTo(
        statItems,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            once: true
          }
        }
      );
    }

    // Why Choose Us features stagger
    if (featuresRef.current.length > 0) {
      staggerFadeUp(featuresRef.current, {
        trigger: whySectionRef.current,
        stagger: 0.2,
        y: 40
      });
    }
  }, []);

  const stats = [
    { value: '2010', label: 'Established', suffix: '' },
    { value: '13,000', label: 'Completed Projects', suffix: '+' },
    { value: '35', label: 'Design Experts', suffix: '+' },
    { value: '100', label: 'Commitment & Warranty', suffix: '%' }
  ];

  const whyFeatures = [
    {
      number: '01',
      title: 'Direct Factory Pricing',
      description:
        'We operate our own full-scale woodworking and joinery factory in Singapore. By eliminating third-party contractor markups, we deliver bespoke, millwork-grade carpentry with honest, transparent pricing.',
      icon: Factory
    },
    {
      number: '02',
      title: 'Accredited Peace of Mind',
      description:
        'Dual-accredited by CaseTrust and BCA with bizSAFE STAR certification. Your deposits are 100% escrow protected, contracts are transparent, and all works strictly adhere to national building guidelines.',
      icon: ShieldCheck
    },
    {
      number: '03',
      title: 'Lifetime Warranty & Support',
      description:
        'Our custom built-ins utilize genuine Austrian Blum hinges and runners backed by lifetime mechanical warranties. We conduct rigorous post-handover inspections and provide dedicated warranty support.',
      icon: Award
    }
  ];

  return (
    <section className="intro-section" ref={introRef} id="intro-section">
      <div className="container">
        {/* Top Editorial Split Header */}
        <div className="intro-editorial-grid">
          <div ref={leftColRef} className="intro-left-col">
            <span className="eyebrow">DESIGN PHILOSOPHY</span>
            <h2 className="intro-title">
              Spaces that are designed to be lived in.
            </h2>
          </div>

          <div ref={rightColRef} className="intro-right-col">
            <p className="intro-lead">
              At CARPENTERS, we believe true luxury lies not in ostentatious ornamentation,
              but in the quiet harmony of proportion, materiality, and light.
            </p>
            <p className="intro-subtext">
              For over a decade, we have partnered with discerning homeowners across Singapore
              to craft residences that respond intimately to their daily rituals. From expansive
              landed estates to thoughtfully reimagined HDB homes, every line drawn and joint
              crafted is an exercise in enduring quality.
            </p>
            <div className="intro-link-wrap">
              <Link to="/about" className="btn-link">
                <span>Learn more about our heritage</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div ref={statsRef} className="intro-stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-item">
              <div className="stat-number">
                {stat.value}
                <span className="stat-suffix">{stat.suffix}</span>
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Why Choose Us Split Section */}
        <div ref={whySectionRef} className="why-us-wrapper">
          <div className="why-us-header">
            <span className="eyebrow">OUR DISTINCTION</span>
            <h2 className="why-us-title">
              Built on trust.
              <br />
              Designed with intention.
            </h2>
          </div>

          <div className="why-us-grid">
            {whyFeatures.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  ref={(el) => (featuresRef.current[index] = el)}
                  className="why-card"
                >
                  <div className="why-top-row">
                    <span className="why-number">{item.number}</span>
                    <div className="why-icon-box">
                      <IconComponent size={20} className="why-icon" />
                    </div>
                  </div>
                  <h3 className="why-title">{item.title}</h3>
                  <div className="why-separator" />
                  <p className="why-desc">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
