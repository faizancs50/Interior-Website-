import React, { useState, useRef } from 'react';
import { Plus, Minus } from 'lucide-react';
import { faqData } from '../../data/faq';
import './FAQ.css';

const FAQ = () => {
  // Only one open at a time; first one open by default
  const [openId, setOpenId] = useState('faq-1');

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="faq-section" id="faq-section">
      <div className="container">
        <div className="faq-layout">
          {/* Left Column Sticky Header */}
          <div className="faq-left-col">
            <span className="eyebrow">COMMON INQUIRIES</span>
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <p className="faq-intro">
              Everything you need to know about our design philosophy, timelines,
              custom carpentry, and warranty protection.
            </p>
            <div className="faq-support-box">
              <span className="faq-support-title">Have a specific inquiry?</span>
              <p className="faq-support-sub">
                Our interior consultants are ready to review your floor plan.
              </p>
              <a href="/contact" className="btn-link">
                Speak With A Designer →
              </a>
            </div>
          </div>

          {/* Right Column Accordion */}
          <div className="faq-right-col" role="region" aria-label="FAQ Accordion">
            {faqData.map((item, index) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`faq-item ${isOpen ? 'open' : ''}`}
                >
                  <button
                    className="faq-question-btn"
                    onClick={() => toggleFAQ(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                    id={`faq-btn-${item.id}`}
                  >
                    <span className="faq-num">0{index + 1}</span>
                    <span className="faq-question-text">{item.question}</span>
                    <div className="faq-icon-wrapper">
                      {isOpen ? (
                        <Minus size={18} className="faq-toggle-icon" />
                      ) : (
                        <Plus size={18} className="faq-toggle-icon" />
                      )}
                    </div>
                  </button>

                  <div
                    id={`faq-answer-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-btn-${item.id}`}
                    className="faq-answer-wrapper"
                    style={{
                      maxHeight: isOpen ? '400px' : '0px'
                    }}
                  >
                    <div className="faq-answer-inner">
                      <p className="faq-answer-text">{item.answer}</p>
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

export default FAQ;
