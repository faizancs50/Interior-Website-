import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Calendar,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { pageEnter } from '../animations/pageTransitions';
import './Consultation.css';

const Consultation = () => {
  const [searchParams] = useSearchParams();
  const prefilledStyle = searchParams.get('style') || '';
  const prefilledService = searchParams.get('service') || '';
  const pageRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: 'BTO',
    budget: '$40k – $70k',
    designStyle: prefilledStyle || 'Modern Minimalist',
    consultationDate: '',
    message: '',
    floorPlanName: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  useEffect(() => {
    pageEnter(pageRef.current);
    // Set default date to next week
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const dateStr = nextWeek.toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, consultationDate: dateStr }));
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your full name.';
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email.';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number.';
    }
    if (!formData.consultationDate) {
      newErrors.consultationDate = 'Please select a preferred date.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, floorPlanName: file.name }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingRef(`CR-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      setIsBooked(true);
    }, 1100);
  };

  const handleReset = () => {
    setIsBooked(false);
    setFormData((prev) => ({
      ...prev,
      name: '',
      email: '',
      phone: '',
      message: '',
      floorPlanName: ''
    }));
  };

  return (
    <div ref={pageRef} className="page-consultation">
      {/* Consultation Header */}
      <section className="consultation-hero">
        <div className="container">
          <span className="eyebrow">DESIGN CONSULTATION</span>
          <h1 className="consultation-title">
            Begin With An Architectural
            <br />
            Discovery Session.
          </h1>
          <p className="consultation-lead">
            Meet with our senior interior architects at our Oxley Bizhub showroom.
            We will examine your floor plan, assess spatial configurations, and outline
            a preliminary budget with zero obligation.
          </p>
        </div>
      </section>

      {/* Main Form & Trust Pillars */}
      <section className="consultation-section">
        <div className="container">
          <div className="consultation-layout">
            {/* Left: Consultation Form */}
            <div className="consultation-form-card">
              {isBooked ? (
                <div className="consultation-success-view">
                  <div className="booking-badge-icon">
                    <CheckCircle2 size={54} className="booking-check" />
                  </div>
                  <span className="booking-ref-label">CONSULTATION CONFIRMED</span>
                  <h2 className="booking-confirm-title">
                    We Look Forward To Welcoming You.
                  </h2>
                  <p className="booking-confirm-text">
                    Your appointment has been registered with booking reference{' '}
                    <strong>{bookingRef}</strong>. A dedicated senior designer will review
                    your property specifications and email your calendar invite along with
                    directions to our studio.
                  </p>

                  <div className="booking-summary-box">
                    <div className="summary-item">
                      <span className="summary-lbl">Client</span>
                      <span className="summary-val">{formData.name}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-lbl">Preferred Date</span>
                      <span className="summary-val">{formData.consultationDate}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-lbl">Property Type</span>
                      <span className="summary-val">{formData.propertyType}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-lbl">Design Style</span>
                      <span className="summary-val">{formData.designStyle}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-lbl">Estimated Budget</span>
                      <span className="summary-val">{formData.budget}</span>
                    </div>
                    {formData.floorPlanName && (
                      <div className="summary-item">
                        <span className="summary-lbl">Floor Plan Attached</span>
                        <span className="summary-val">{formData.floorPlanName}</span>
                      </div>
                    )}
                  </div>

                  <div className="booking-action-row">
                    <button onClick={handleReset} className="btn btn-outline">
                      <span>Book Another Appointment</span>
                    </button>
                    <a href="/portfolio" className="btn btn-primary">
                      <span>Browse Portfolio While You Wait</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form className="consultation-form" onSubmit={handleSubmit} noValidate>
                  <div className="form-section-title-wrap">
                    <h3 className="form-section-heading">Your Project Details</h3>
                    <p className="form-section-sub">
                      All consultations are strictly 1-on-1 with a senior design lead.
                    </p>
                  </div>

                  {/* Name, Email, Phone */}
                  <div className="consult-form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="consult-name">
                        Full Name <span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        id="consult-name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={`form-input ${errors.name ? 'has-error' : ''}`}
                      />
                      {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="consult-email">
                        Email Address <span className="req">*</span>
                      </label>
                      <input
                        type="email"
                        id="consult-email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="yourname@domain.com"
                        className={`form-input ${errors.email ? 'has-error' : ''}`}
                      />
                      {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="consult-phone">
                        Phone Number <span className="req">*</span>
                      </label>
                      <input
                        type="tel"
                        id="consult-phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+65 9123 4567"
                        className={`form-input ${errors.phone ? 'has-error' : ''}`}
                      />
                      {errors.phone && <span className="form-error">{errors.phone}</span>}
                    </div>

                    {/* Preferred Date */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="consult-date">
                        Preferred Date <span className="req">*</span>
                      </label>
                      <input
                        type="date"
                        id="consult-date"
                        name="consultationDate"
                        value={formData.consultationDate}
                        onChange={handleChange}
                        className={`form-input ${errors.consultationDate ? 'has-error' : ''}`}
                      />
                      {errors.consultationDate && (
                        <span className="form-error">{errors.consultationDate}</span>
                      )}
                    </div>
                  </div>

                  {/* Property Type Radio / Selector */}
                  <div className="form-group">
                    <label className="form-label">Property Type</label>
                    <div className="property-pills-row">
                      {['HDB', 'BTO', 'Condo', 'Landed', 'Commercial'].map((type) => (
                        <button
                          type="button"
                          key={type}
                          className={`prop-pill ${formData.propertyType === type ? 'active' : ''}`}
                          onClick={() => setFormData((p) => ({ ...p, propertyType: type }))}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget & Style */}
                  <div className="consult-form-grid-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="consult-budget">
                        Target Budget
                      </label>
                      <select
                        id="consult-budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="Below $40,000">Below $40,000</option>
                        <option value="$40,000 – $70,000">$40,000 – $70,000 (Standard BTO / Condo)</option>
                        <option value="$70,000 – $100,000">$70,000 – $100,000 (Full Gut Resale)</option>
                        <option value="$100,000 – $150,000">$100,000 – $150,000 (Luxury Condo / Penthouse)</option>
                        <option value="$150,000 and above">$150,000 and above (Landed / Architectural Estate)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="consult-style">
                        Preferred Design Style
                      </label>
                      <select
                        id="consult-style"
                        name="designStyle"
                        value={formData.designStyle}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="Modern Minimalist">Modern Minimalist</option>
                        <option value="Japandi & Wabi-Sabi">Japandi &amp; Wabi-Sabi</option>
                        <option value="Contemporary Architectural">Contemporary Architectural</option>
                        <option value="Quiet Luxury">Quiet Luxury &amp; Monolithic</option>
                        <option value="Mid-Century Modern">Mid-Century Modern</option>
                        <option value="Undecided / Open to Recommendations">Undecided / Open to Recommendations</option>
                      </select>
                    </div>
                  </div>

                  {/* Floor Plan Upload (Mock with file picker & label) */}
                  <div className="form-group">
                    <label className="form-label">Upload Floor Plan (Optional)</label>
                    <div className="floor-plan-dropzone">
                      <input
                        type="file"
                        id="floorplan-file"
                        accept=".pdf,.png,.jpg,.jpeg,.dwg"
                        onChange={handleFileUpload}
                        className="dropzone-file-input"
                      />
                      <label htmlFor="floorplan-file" className="dropzone-label">
                        {formData.floorPlanName ? (
                          <div className="dropzone-file-selected">
                            <FileCheck size={28} className="dropzone-check-icon" />
                            <span className="dropzone-filename">{formData.floorPlanName}</span>
                            <span className="dropzone-hint">Click to change file</span>
                          </div>
                        ) : (
                          <div className="dropzone-empty">
                            <UploadCloud size={32} className="dropzone-icon" />
                            <span className="dropzone-main-text">
                              Click or Drag &amp; Drop Floor Plan PDF / JPG
                            </span>
                            <span className="dropzone-hint">Max file size: 25MB</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="consult-msg">
                      Additional Notes / Requirements
                    </label>
                    <textarea
                      id="consult-msg"
                      name="message"
                      rows="3"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Let us know key collection timeframe, specific carpentry dreams, or living habits..."
                      className="form-textarea"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-accent consult-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>Reserving Your Consultation...</span>
                    ) : (
                      <>
                        <span>Request Consultation</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right: What To Expect & Guarantees */}
            <aside className="consultation-sidebar">
              <div className="sidebar-card">
                <span className="sidebar-eyebrow">WHAT TO EXPECT</span>
                <h3 className="sidebar-title">The Discovery Session</h3>
                
                <ul className="expect-list">
                  <li className="expect-item">
                    <div className="expect-num">01</div>
                    <div>
                      <h4 className="expect-item-title">Floor Plan Structural Audit</h4>
                      <p className="expect-item-desc">
                        Identifying hacking constraints, load-bearing walls, and plumbing access points.
                      </p>
                    </div>
                  </li>

                  <li className="expect-item">
                    <div className="expect-num">02</div>
                    <div>
                      <h4 className="expect-item-title">Lifestyle Zoning</h4>
                      <p className="expect-item-desc">
                        Analyzing your daily rituals, storage requirements, and lighting preferences.
                      </p>
                    </div>
                  </li>

                  <li className="expect-item">
                    <div className="expect-num">03</div>
                    <div>
                      <h4 className="expect-item-title">Transparent Feasibility</h4>
                      <p className="expect-item-desc">
                        Honest budget benchmarking based on direct factory manufacturing pricing.
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="sidebar-trust-box">
                  <ShieldCheck size={24} className="trust-icon" />
                  <div>
                    <span className="trust-title">Zero Obligation &amp; 100% CaseTrust Protection</span>
                    <p className="trust-sub">
                      You are never pressured. We believe exceptional design speaks for itself.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Consultation;
