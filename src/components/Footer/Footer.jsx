import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Instagram, Facebook, Linkedin, MapPin, Phone, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" id="main-footer">
      <div className="container">
        {/* Top Brand & Scroll to Top Bar */}
        <div className="footer-top-bar">
          <Link to="/" className="footer-logo">
            <svg
              className="footer-logo-svg"
              viewBox="0 0 260 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="translate(2, 4)">
                <rect
                  x="0"
                  y="0"
                  width="32"
                  height="32"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  fill="none"
                />
                <line
                  x1="0"
                  y1="16"
                  x2="32"
                  y2="16"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.6"
                />
                <line
                  x1="16"
                  y1="0"
                  x2="16"
                  y2="32"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <polygon
                  points="16,5 27,16 16,27 5,16"
                  fill="none"
                  stroke="#A59682"
                  strokeWidth="1.5"
                />
                <circle cx="16" cy="16" r="2" fill="#FFFFFF" />
              </g>
              <text
                x="48"
                y="22"
                fontFamily="'Cormorant Garamond', Georgia, serif"
                fontSize="20"
                fontWeight="600"
                letterSpacing="4"
                fill="#FFFFFF"
              >
                CARPENTERS
              </text>
              <text
                x="49"
                y="33"
                fontFamily="'Plus Jakarta Sans', sans-serif"
                fontSize="7"
                fontWeight="600"
                letterSpacing="2.8"
                fill="#A59682"
              >
                DESIGN &amp; RENOVATION
              </text>
            </svg>
          </Link>

          <button
            onClick={scrollToTop}
            className="footer-scroll-top-btn"
            aria-label="Back to top"
          >
            <span>Back to Top</span>
            <ArrowUp size={16} />
          </button>
        </div>

        {/* 4 Main Columns */}
        <div className="footer-main-grid">
          {/* Column 1: Company */}
          <div className="footer-col">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/about#team">Our Team</Link>
              </li>
              <li>
                <Link to="/portfolio">Portfolio</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/consultation">Book Consultation</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Services */}
          <div className="footer-col">
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              <li>
                <Link to="/services#hdb-interior-design">HDB Design &amp; BTO</Link>
              </li>
              <li>
                <Link to="/services#condominium">Condominium Fit-Outs</Link>
              </li>
              <li>
                <Link to="/services#landed-property">Landed Property Architecture</Link>
              </li>
              <li>
                <Link to="/services#commercial-interiors">Commercial &amp; Retail</Link>
              </li>
              <li>
                <Link to="/services#custom-carpentry">Custom In-House Carpentry</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="footer-col">
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-contact-details">
              <div className="footer-contact-row">
                <MapPin size={16} className="footer-contact-icon" />
                <span>
                  62 Ubi Road 1, #01-20 Oxley Bizhub 2,
                  <br />
                  Singapore 408734
                </span>
              </div>
              <div className="footer-contact-row">
                <Phone size={16} className="footer-contact-icon" />
                <span>+65 6443 9011 / +65 6844 7177</span>
              </div>
              <div className="footer-contact-row">
                <Mail size={16} className="footer-contact-icon" />
                <span>enquiry@carpenters.com.sg</span>
              </div>
              <div className="footer-hours">
                <span>Daily: 10:00 AM – 8:00 PM (By Appointment)</span>
              </div>
            </div>
          </div>

          {/* Column 4: Social & Accreditations */}
          <div className="footer-col">
            <h4 className="footer-heading">Social</h4>
            <div className="footer-social-links">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-pill"
                aria-label="Instagram"
              >
                <Instagram size={16} />
                <span>Instagram</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-pill"
                aria-label="Facebook"
              >
                <Facebook size={16} />
                <span>Facebook</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-pill"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
                <span>LinkedIn</span>
              </a>
            </div>

            <div className="footer-accreditation-snippet">
              <span className="footer-accred-title">Accredited Member</span>
              <p>CaseTrust • bizSAFE STAR • BCA Licensed • HDB Registered</p>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © 2026 CARPENTERS. All Rights Reserved.
          </p>

          <div className="footer-legal-links">
            <a href="#privacy">Privacy Policy</a>
            <span className="footer-legal-sep">•</span>
            <a href="#terms">Terms of Engagement</a>
            <span className="footer-legal-sep">•</span>
            <a href="#casetrust">CaseTrust Escrow Protection</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
