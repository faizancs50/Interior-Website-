import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, FileText, Box, HardHat, Key } from 'lucide-react';
import './Process.css';

gsap.registerPlugin(ScrollTrigger);

const Process = () => {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);
  const stepItemsRef = useRef([]);

  const steps = [
    {
      num: '01',
      title: 'Consultation',
      subtitle: 'Spatial Discovery & Feasibility',
      description:
        'In-depth discussion at our flagship studio analyzing your floor plan, spatial pain points, lifestyle preferences, and preliminary budget benchmarks.',
      icon: MessageSquare,
      deliverable: 'Spatial brief & project roadmap'
    },
    {
      num: '02',
      title: 'Proposal',
      subtitle: 'Transparent Financials',
      description:
        'Line-by-line itemized quotation with zero hidden markups, initial space configuration layout drawings, and material recommendation boards.',
      icon: FileText,
      deliverable: 'Detailed itemized contract & CaseTrust escrow'
    },
    {
      num: '03',
      title: '3D Design',
      subtitle: 'Photorealistic Architecture',
      description:
        'High-fidelity 3D photorealistic renderings, lighting plans, and finish sample boards. Walk through your future sanctuary before physical works commence.',
      icon: Box,
      deliverable: 'Full 3D rendering suite & elevation schematics'
    },
    {
      num: '04',
      title: 'Site & Construction',
      subtitle: 'Artisanal Execution',
      description:
        'Demolition, masonry, BCA-certified waterproofing, electrical routing, and custom carpentry fabrication in our Singapore woodworking factory.',
      icon: HardHat,
      deliverable: 'Weekly photographic progress & milestone logs'
    },
    {
      num: '05',
      title: 'Handover',
      subtitle: 'Flawless Defect-Free Delivery',
      description:
        'Rigorous quality control inspection, professional chemical deep cleaning, complete defect clearance, and official key handover with lifetime warranty.',
      icon: Key,
      deliverable: 'Warranty deed & defect warranty certification'
    }
  ];

  useEffect(() => {
    // ScrollTrigger to highlight active step as user scrolls through the section
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      end: 'bottom 40%',
      onUpdate: (self) => {
        const index = Math.min(
          Math.floor(self.progress * steps.length),
          steps.length - 1
        );
        setActiveStep(index);
      }
    });

    // Stagger animation for step items
    if (stepItemsRef.current.length > 0) {
      gsap.fromTo(
        stepItemsRef.current,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true
          }
        }
      );
    }

    return () => {
      st.kill();
    };
  }, [steps.length]);

  return (
    <section className="process-section" ref={sectionRef} id="process-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header center">
          <span className="eyebrow">OUR METHODOLOGY</span>
          <h2 className="section-title">
            From First Conversation to Final Detail
          </h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            A disciplined five-phase architectural process engineered for absolute clarity,
            financial transparency, and immaculate execution.
          </p>
        </div>

        {/* Desktop Horizontal Timeline & Mobile Vertical */}
        <div className="process-timeline-container">
          {/* Progress Connecting Line */}
          <div className="process-progress-track">
            <div
              className="process-progress-fill"
              style={{
                width: `${((activeStep + 1) / steps.length) * 100}%`
              }}
            />
          </div>

          <div className="process-steps-grid">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              const isPast = activeStep > idx;

              return (
                <div
                  key={step.num}
                  ref={(el) => (stepItemsRef.current[idx] = el)}
                  className={`process-step-item ${isActive ? 'active' : ''} ${
                    isPast ? 'past' : ''
                  }`}
                  onClick={() => setActiveStep(idx)}
                >
                  {/* Step Marker Node */}
                  <div className="step-marker-wrap">
                    <div className="step-marker-node">
                      <span className="step-num-text">{step.num}</span>
                    </div>
                  </div>

                  {/* Step Card Content */}
                  <div className="step-content-card">
                    <div className="step-header">
                      <div className="step-icon-box">
                        <Icon size={18} />
                      </div>
                      <span className="step-title-name">{step.title}</span>
                    </div>

                    <h4 className="step-subtitle">{step.subtitle}</h4>
                    <p className="step-body-desc">{step.description}</p>

                    <div className="step-deliverable-box">
                      <span className="deliverable-label">Key Deliverable:</span>
                      <span className="deliverable-val">{step.deliverable}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
