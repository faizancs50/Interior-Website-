import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { pageEnter } from '../animations/pageTransitions';
import './Contact.css';

const Contact = () => {
  const pageRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Architecture',
    location: '',
    budget: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [submittedInfo, setSubmittedInfo] = useState(null);

  useEffect(() => {
    pageEnter(pageRef.current);
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please provide your full name (at least 2 characters).';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Please provide your contact number.';
    } else if (!/^[0-9+() -]{7,20}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (minimum 7 digits).';
    }

    if (!formData.location.trim() || formData.location.trim().length < 2) {
      newErrors.location = 'Please provide your project location or district.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      newErrors.message = 'Please share a brief note about your project (at least 5 characters).';
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
    if (serverError) {
      setServerError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double-clicking / rapid duplicate submission

    if (!validate()) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setSubmittedInfo({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          projectType: formData.projectType,
          location: formData.location,
          budget: formData.budget || 'Not specified',
          reference: data.enquiryId
            ? `#${data.enquiryId.slice(-6).toUpperCase()}`
            : `#${Math.floor(100000 + Math.random() * 900000)}`,
          message: data.message || 'Thank you! Your enquiry has been received. Our team will contact you shortly.'
        });
        setIsSubmitted(true);
      } else {
        // Handle server error gracefully (Google Sheets failure, validation, rate-limiting)
        setServerError(
          data.message ||
            'We were unable to record your enquiry into our scheduling system at this time. Please try again shortly or contact us directly at enquiry@carpenters.com.sg.'
        );
      }
    } catch (err) {
      setServerError(
        'A network connection error occurred while submitting your enquiry. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      projectType: 'Architecture',
      location: '',
      budget: '',
      message: ''
    });
    setErrors({});
    setServerError(null);
    setSubmittedInfo(null);
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
            our senior architects and interior designers are at your service.
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
                    Thank you! Your enquiry has been received. Our team will contact you shortly.
                  </p>
                  <div className="success-details">
                    <p>Reference: <strong>{submittedInfo?.reference}</strong></p>
                    <p>Client: <strong>{submittedInfo?.name}</strong></p>
                    <p>Project Type: <strong>{submittedInfo?.projectType}</strong></p>
                    <p>Location: <strong>{submittedInfo?.location}</strong></p>
                    <p>Contact: <strong>{submittedInfo?.email} • {submittedInfo?.phone}</strong></p>
                    {submittedInfo?.budget && submittedInfo?.budget !== 'Not specified' && (
                      <p>Estimated Budget: <strong>{submittedInfo?.budget}</strong></p>
                    )}
                  </div>
                  <button onClick={resetForm} className="btn btn-outline success-reset-btn">
                    <span>Send Another Inquiry</span>
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <h3 className="form-heading">Send An Enquiry</h3>
                  <p className="form-sub">
                    Fill in your project requirements below to schedule an architectural consultation.
                  </p>

                  {/* Server error alert banner if submission fails */}
                  {serverError && (
                    <div className="form-server-error" role="alert">
                      <AlertCircle size={20} className="form-server-error-icon" />
                      <div>{serverError}</div>
                    </div>
                  )}

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
                      Project Type <span className="req">*</span>
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="Architecture">Architecture</option>
                      <option value="Interior Design">Interior Design</option>
                      <option value="Residential">Residential (HDB / Condo / Landed)</option>
                      <option value="Commercial">Commercial (Office / Retail / F&B)</option>
                      <option value="Other">Other / Bespoke Consultation</option>
                    </select>
                  </div>

                  {/* Location & Budget */}
                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="location" className="form-label">
                        Location / District <span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Marina Bay, Orchard, Bukit Timah"
                        className={`form-input ${errors.location ? 'has-error' : ''}`}
                      />
                      {errors.location && <span className="form-error">{errors.location}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="budget" className="form-label">
                        Estimated Budget (Optional)
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select budget range (Optional)</option>
                        <option value="Below $50,000">Below $50,000</option>
                        <option value="$50,000 – $100,000">$50,000 – $100,000</option>
                        <option value="$100,000 – $200,000">$100,000 – $200,000</option>
                        <option value="$200,000 – $350,000">$200,000 – $350,000</option>
                        <option value="$350,000+">$350,000 and above (Landed / Luxury)</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="form-group">
                    <label htmlFor="message" className="form-label">
                      Message / Project Details <span className="req">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Share details about key collection date, aesthetic preferences (e.g. Japandi, Modern Minimalist), or specific architectural requirements..."
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
                      <>
                        <Loader2 size={16} className="submit-spinner" />
                        <span>Sending Your Enquiry...</span>
                      </>
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
