import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both your administrator email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick fill helper for testing authorized accounts
  const fillCredentials = (type) => {
    setError('');
    if (type === 'owner') {
      setEmail('owner@carpenters.com.sg');
      setPassword('OwnerCarpenters2026!');
    } else if (type === 'dev') {
      setEmail('developer@carpenters.com.sg');
      setPassword('DevCarpenters2026!');
    }
  };

  return (
    <div className="admin-login-page">
      {/* Top Bar with Back to Site and Theme Switch */}
      <header className="admin-login-topbar">
        <Link to="/" className="admin-back-link">
          <ArrowLeft size={16} />
          <span>Return to Public Website</span>
        </Link>

        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </header>

      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-card-header">
            <div className="admin-monogram-badge">
              <ShieldCheck size={28} />
            </div>
            <span className="admin-eyebrow">RESTRICTED PORTAL</span>
            <h1 className="admin-login-title">CARPENTERS Studio</h1>
            <p className="admin-login-subtitle">
              Sign in with your authorized administrator credentials to manage projects,
              curations, and public portfolio content.
            </p>
          </div>

          {error && (
            <div className="admin-error-banner" role="alert">
              <AlertCircle size={18} className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
            <div className="form-group">
              <label htmlFor="admin-email" className="form-label">
                Administrator Email
              </label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="admin-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@carpenters.com.sg"
                  className="form-input admin-input"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="admin-pass" className="form-label">
                Password
              </label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  id="admin-pass"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="form-input admin-input"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary admin-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Access Admin Panel</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Authorized Accounts Quick Fill Box */}
          <div className="admin-quick-fill-box">
            <span className="quick-fill-title">Authorized Admin Accounts:</span>
            <div className="quick-fill-buttons">
              <button
                type="button"
                className="quick-fill-btn"
                onClick={() => fillCredentials('owner')}
              >
                1. Website Owner
              </button>
              <button
                type="button"
                className="quick-fill-btn"
                onClick={() => fillCredentials('dev')}
              >
                2. Website Developer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
