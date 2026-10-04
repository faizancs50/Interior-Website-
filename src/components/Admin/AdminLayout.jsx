import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  Inbox,
  ExternalLink,
  LogOut,
  Sun,
  Moon,
  User,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'All Projects', path: '/admin/projects', icon: FolderKanban },
    { label: 'Add Project', path: '/admin/projects/new', icon: PlusCircle },
    { label: 'Enquiries & Sheets', path: '/admin/enquiries', icon: Inbox }
  ];

  return (
    <div className="admin-app">
      {/* Top Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <button
            type="button"
            className="admin-hamburger"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/admin" className="admin-brand-link">
            <span className="admin-brand-name">CARPENTERS</span>
            <span className="admin-brand-portal">STUDIO ADMIN</span>
          </Link>
        </div>

        <div className="admin-header-right">
          {/* View Live Website Link */}
          <Link to="/" target="_blank" rel="noopener noreferrer" className="admin-live-link">
            <span>View Website</span>
            <ExternalLink size={14} />
          </Link>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* User Profile Pill */}
          <div className="admin-user-pill">
            <div className="user-avatar-circle">
              <User size={15} />
            </div>
            <div className="user-details-snippet">
              <span className="user-name-text">{user?.name || 'Administrator'}</span>
              <span className="user-role-text">{user?.title || user?.role || 'Admin'}</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="admin-logout-btn"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut size={16} />
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="admin-body">
        {/* Sidebar Navigation */}
        <aside className={`admin-sidebar ${mobileNavOpen ? 'mobile-open' : ''}`}>
          <div className="admin-sidebar-section">
            <span className="sidebar-group-title">PROJECT MANAGEMENT</span>
            <nav className="admin-nav-list">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `admin-nav-item ${isActive ? 'active' : ''}`
                    }
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <Icon size={18} className="nav-item-icon" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="admin-sidebar-footer">
            <div className="admin-sidebar-user-box">
              <p className="admin-session-title">Logged In As</p>
              <p className="admin-session-email">{user?.email}</p>
            </div>
          </div>
        </aside>

        {/* Content View */}
        <main className="admin-main-viewport">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
