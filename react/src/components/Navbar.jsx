import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const navStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #f0f0f0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    padding: '0 0',
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '2rem',
  };

  const brandStyle = {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1B5E20',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    letterSpacing: '-0.5px',
  };

  const navMenuStyle = {
    display: mobileMenuOpen ? 'flex' : 'flex',
    flexDirection: window.innerWidth <= 768 && mobileMenuOpen ? 'column' : 'row',
    alignItems: 'center',
    listStyle: 'none',
    gap: '0.5rem',
    margin: 0,
    padding: 0,
    flex: 1,
    justifyContent: 'center',
  };

  const navItemStyle = {
    position: 'relative',
  };

  const linkStyle = {
    color: '#374151',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: 500,
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    cursor: 'pointer',
  };

  const linkHoverStyle = {
    color: '#1B5E20',
    backgroundColor: 'rgba(27, 94, 32, 0.08)',
  };

  const [hovered, setHovered] = useState(null);

  const buttonStyle = {
    padding: '0.65rem 1.25rem',
    borderRadius: '8px',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'inline-block',
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#1B5E20',
    color: '#ffffff',
  };

  const primaryButtonHoverStyle = {
    backgroundColor: '#145a1f',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(27, 94, 32, 0.3)',
  };

  const rightContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  };

  const languageSwitcherStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    border: '2px solid #e5e7eb',
    backgroundColor: '#fafafa',
    color: '#374151',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const languageSwitcherHoverStyle = {
    borderColor: '#1B5E20',
    backgroundColor: 'rgba(27, 94, 32, 0.05)',
    color: '#1B5E20',
  };

  const userProfileStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(27, 94, 32, 0.08)',
    borderRadius: '8px',
    color: '#1B5E20',
    fontSize: '0.9rem',
    fontWeight: 500,
  };

  const [langHovered, setLangHovered] = useState(false);

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        {/* Logo */}
        <Link to="/" style={brandStyle}>
          <span style={{ fontSize: '1.8rem' }}>🌾</span>
          <span>InsuChain</span>
        </Link>

        {/* Navigation Menu */}
        <ul style={navMenuStyle}>
          {[
            { path: '/', label: t.navbar.home },
            { path: '/policies', label: t.navbar.policies },
            { path: '/how-it-works', label: t.navbar.howItWorks },
            { path: '/faq', label: t.navbar.faq },
            { path: '/contact', label: t.navbar.contact },
          ].map((item) => (
            <li key={item.path} style={navItemStyle}>
              <Link
                to={item.path}
                style={{
                  ...linkStyle,
                  ...(hovered === item.path ? linkHoverStyle : {}),
                }}
                onMouseEnter={() => setHovered(item.path)}
                onMouseLeave={() => setHovered(null)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Side: Auth, Dashboard, Language Switch */}
        <div style={rightContainerStyle}>
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            style={{
              ...languageSwitcherStyle,
              ...(langHovered ? languageSwitcherHoverStyle : {}),
            }}
            onMouseEnter={() => setLangHovered(true)}
            onMouseLeave={() => setLangHovered(false)}
            title="Switch language"
          >
            {language === 'en' ? '🇬🇧 EN' : '🇮🇳 HI'}
          </button>

          {isAuthenticated ? (
            <>
              {/* User Profile */}
              <Link
                to="/profile"
                style={{
                  ...userProfileStyle,
                  textDecoration: 'none',
                  color: 'inherit',
                  fontSize: '0.85rem',
                }}
              >
                👤 {user?.email?.split('@')[0]}
              </Link>

              {/* Admin Dashboard Link */}
              {isAdmin && (
                <Link
                  to="/dashboard"
                  style={{
                    ...linkStyle,
                    color: '#D97706',
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#92400e';
                    e.currentTarget.style.backgroundColor = 'rgba(217, 119, 6, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#D97706';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  📊 {t.navbar.dashboard}
                </Link>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  ...primaryButtonStyle,
                  backgroundColor: '#ef4444',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {t.navbar.logout}
              </button>
            </>
          ) : (
            <>
              {/* Login & Register Buttons */}
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor: 'transparent',
                    color: '#1B5E20',
                    border: '2px solid #1B5E20',
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1B5E20';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#1B5E20';
                  }}
                >
                  {t.navbar.login}
                </button>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button
                  style={primaryButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#145a1f';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(27, 94, 32, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1B5E20';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {t.navbar.register}
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
