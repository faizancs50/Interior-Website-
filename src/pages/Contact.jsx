import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { pageEnter } from '../animations/pageTransitions';
import './Contact.css';

const Contact = () => {
  const pageRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'HDB BTO',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    pageEnter(pageRef.current);
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please provide your full name.';
    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please provide your contact number.';
    } else if (!/^[0-9+() -]{7,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number.';
    }
    if (!formData.message.trim()) newErrors.message = 'Please share a brief note about your project.';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate frontend submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      projectType: 'HDB BTO',
      message: ''
    });
    setIsSubmitted(false);
  };

  return (
    <div ref={pageRef} className="page-contact">
      {/* Header */}
      <section className="contact-hero">
        <div className="container">
          <span className="eyebrow">GET IN TOUCH</span>
          <h1 className="contact-title">Let's Discuss Your Space.</h1>
          <p className="contact-lead">
            Whether you are receiving keys to a new home or re-imagining a heritage residence,
            our senior interior designers are at your service.
          </p>
        </div>
      </section>

      {/* Main Split Section */}
      <section className="contact-main-section">
        <div className="container">
          <div className="contact-grid">
            {/* Left: Contact Info & Studio Location */}
            <div className="contact-info-panel">
              <div className="info-block">
                <span className="info-block-eyebrow">FLAGSHIP DESIGN ATELIER</span>
                <h3 className="info-block-title">Oxley Bizhub 2 Studio</h3>
                <div className="info-item">
                  <MapPin size={20} className="info-icon" />
                  <p>
                    62 Ubi Road 1, #01-20 Oxley Bizhub 2,
                    <br />
                    Singapore 408734
                    <br />
                    <span className="info-subtext">(5 mins from Tai Seng MRT Station)</span>
                  </p>
                </div>
              </div>

              <div className="info-block">
                <span className="info-block-eyebrow">DIRECT COMMUNICATIONS</span>
                <div className="info-item">
                  <Phone size={20} className="info-icon" />
                  <div>
                    <p>+65 6443 9011 (Showroom)</p>
                    <p>+65 6844 7177 (Direct Factory)</p>
                  </div>
                </div>
                <div className="info-item">
                  <Mail size={20} className="info-icon" />
                  <div>
                    <p>enquiry@carpenters.com.sg</p>
                    <p>support@carpenters.com.sg</p>
                  </div>
                </div>
                <div className="info-item">
                  <Clock size={20} className="info-icon" />
                  <div>
                    <p>Monday – Sunday: 10:00 AM – 8:00 PM</p>
                    <span className="info-subtext">Appointments recommended for tailored consultations</span>
                  </div>
                </div>
              </div>

              {/* Accreditations strip */}
              <div className="contact-accred-banner">
                <span className="accred-label">Statutory Guarantees:</span>
                <p>CaseTrust Accredited • BCA DRC Registered • bizSAFE STAR Level</p>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="contact-form-panel">
              {isSubmitted ? (
                <div className="contact-success-card">
                  <div className="success-icon-wrap">
                    <CheckCircle2 size={48} className="success-icon" />
                  </div>
                  <h3 className="success-title">Message Received With Gratitude</h3>
                  <p className="success-desc">
                    Thank you, <strong>{formData.name}</strong>. One of our design architects
                    will review your project brief and contact you within 24 business hours.
                  </p>
                  <div className="success-details">
                    <p>Reference: #{Math.floor(100000 + Math.random() * 900000)}</p>
                    <p>Project Type: {formData.projectType}</p>
                    <p>Contact: {formData.email}</p>
                  </div>
                  <button onClick={resetForm} className="btn btn-outline success-reset-btn">
                    <span>Send Another Inquiry</span>
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <h3 className="form-heading">Send An Inquiry</h3>
                  <p className="form-sub">
                    Fill in your project requirements below to schedule a discussion.
                  </p>

                  {/* Name field */}
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Full Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Sarah Tan"
                      className={`form-input ${errors.name ? 'has-error' : ''}`}
                    />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>

                  {/* Email & Phone */}
                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email Address <span className="req">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="sarahtan@example.com"
                        className={`form-input ${errors.email ? 'has-error' : ''}`}
                      />
                      {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">
                        Phone / WhatsApp <span className="req">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+65 9123 4567"
                        className={`form-input ${errors.phone ? 'has-error' : ''}`}
                      />
                      {errors.phone && <span className="form-error">{errors.phone}</span>}
                    </div>
                  </div>

                  {/* Project Type */}
                  <div className="form-group">
                    <label htmlFor="projectType" className="form-label">
                      Property / Project Type
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="HDB BTO">HDB BTO Flat</option>
                      <option value="HDB Resale">HDB Resale Flat</option>
                      <option value="Private Condominium">Private Condominium</option>
                      <option value="Landed Residence">Landed Residence (Terrace / Semi-D / Bungalow)</option>
                      <option value="Commercial / Office">Commercial Interior / Office</option>
                      <option value="Custom Carpentry Only">Custom Carpentry Fabrication Only</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="form-group">
                    <label htmlFor="message" className="form-label">
                      Message &amp; Spatial Brief <span className="req">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Share details about key collection date, aesthetic preferences (e.g. Japandi, Minimalist), or specific hacking requirements..."
                      className={`form-textarea ${errors.message ? 'has-error' : ''}`}
                    />
                    {errors.message && <span className="form-error">{errors.message}</span>}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary form-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>Sending Your Details...</span>
                    ) : (
                      <>
                        <span>Submit Project Brief</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
