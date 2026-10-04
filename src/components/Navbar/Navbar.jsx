import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';
import gsap from 'gsap';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const menuLinksRef = useRef([]);

  const isHome = location.pathname === '/';

  // Listen to window scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // GSAP animation for mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const tl = gsap.timeline();
      tl.to(mobileMenuRef.current, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.35,
        ease: 'power2.out'
      }).fromTo(
        menuLinksRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
        '-=0.1'
      );
    } else {
      document.body.style.overflow = '';
      if (mobileMenuRef.current) {
        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: () => {
            if (mobileMenuRef.current) {
              mobileMenuRef.current.style.visibility = 'hidden';
            }
          }
        });
      }
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Contact', path: '/contact' }
  ];

  // Scrolled state or non-home pages should have light background styling
  const isLightNav = isScrolled || !isHome;

  return (
    <>
      <header
        className={`navbar ${isScrolled ? 'scrolled' : ''} ${
          isLightNav ? 'nav-light' : 'nav-transparent'
        }`}
        id="main-navbar"
      >
        <div className="container navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo" aria-label="CARPENTERS Home">
            <svg
              className="navbar-logo-svg"
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
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <line
                  x1="0"
                  y1="16"
                  x2="32"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.6"
                />
                <line
                  x1="16"
                  y1="0"
                  x2="16"
                  y2="32"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <polygon
                  points="16,5 27,16 16,27 5,16"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="1.5"
                />
                <circle cx="16" cy="16" r="2" fill="currentColor" />
              </g>
              <text
                x="48"
                y="22"
                fontFamily="'Cormorant Garamond', Georgia, serif"
                fontSize="20"
                fontWeight="600"
                letterSpacing="4"
                fill="currentColor"
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
                fill="var(--color-accent)"
              >
                DESIGN &amp; RENOVATION
              </text>
            </svg>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="navbar-links" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar-link ${
                  location.pathname === link.path ? 'active' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Consultation Action & Theme Toggle */}
          <div className="navbar-actions">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              to="/consultation"
              className={`btn navbar-cta ${
                isLightNav ? 'btn-primary' : 'btn-outline-white'
              }`}
            >
              <span>Design Consultation</span>
              <ArrowRight size={14} />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              className="navbar-hamburger"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Menu */}
      <div
        ref={mobileMenuRef}
        className="mobile-menu"
        style={{ visibility: 'hidden', opacity: 0 }}
      >
        <div className="mobile-menu-header">
          <Link
            to="/"
            className="navbar-logo"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="mobile-logo-text">CARPENTERS</span>
          </Link>
          <button
            className="mobile-menu-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close Menu"
          >
            <X size={28} />
          </button>
        </div>

        <div className="mobile-menu-body">
          <nav className="mobile-nav-links">
            <div
              ref={(el) => (menuLinksRef.current[0] = el)}
              className="mobile-link-wrapper"
            >
              <Link
                to="/"
                className={`mobile-nav-link ${
                  location.pathname === '/' ? 'active' : ''
                }`}
              >
                <span className="mobile-link-num">01</span>
                <span className="mobile-link-text">Home</span>
              </Link>
            </div>

            {navLinks.map((link, idx) => (
              <div
                key={link.path}
                ref={(el) => (menuLinksRef.current[idx + 1] = el)}
                className="mobile-link-wrapper"
              >
                <Link
                  to={link.path}
                  className={`mobile-nav-link ${
                    location.pathname === link.path ? 'active' : ''
                  }`}
                >
                  <span className="mobile-link-num">0{idx + 2}</span>
                  <span className="mobile-link-text">{link.name}</span>
                </Link>
              </div>
            ))}

            <div
              ref={(el) => (menuLinksRef.current[navLinks.length + 1] = el)}
              className="mobile-link-wrapper"
            >
              <Link
                to="/consultation"
                className={`mobile-nav-link ${
                  location.pathname === '/consultation' ? 'active' : ''
                }`}
              >
                <span className="mobile-link-num">06</span>
                <span className="mobile-link-text">Consultation</span>
              </Link>
            </div>
          </nav>

          <div
            ref={(el) => (menuLinksRef.current[navLinks.length + 2] = el)}
            className="mobile-menu-footer"
          >
            <div className="mobile-theme-row">
              <span className="mobile-theme-label">
                Appearance: {isDark ? 'Dark Mode' : 'Light Mode'}
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                className="theme-toggle-btn"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>

            <Link
              to="/consultation"
              className="btn btn-accent mobile-cta-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Book Design Consultation</span>
              <ArrowRight size={16} />
            </Link>
            <div className="mobile-contact-snippet">
              <p>Singapore Flagship Design Studio</p>
              <p>+65 6443 9011 • enquiry@carpenters.com.sg</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
