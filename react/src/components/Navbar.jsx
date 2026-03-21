import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  return (
    <nav className="modern-nav">
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '28px' }}>🌾</span>
        <h1 style={{ margin: 0, fontSize: '24px', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          InsuChain
        </h1>
      </Link>

      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {[
          { path: '/', label: t.navbar.home },
          { path: '/policies', label: t.navbar.policies },
          { path: '/how-it-works', label: t.navbar.howItWorks },
          { path: '/faq', label: t.navbar.faq },
          { path: '/contact', label: t.navbar.contact },
        ].map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '20px',
              transition: 'background 0.3s',
              background: location.pathname === item.path ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={toggleLanguage}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: '600',
            fontFamily: 'Outfit, sans-serif'
          }}
        >
          {language === 'en' ? '🇬🇧 EN' : '🇮🇳 HI'}
        </button>

        {isAuthenticated ? (
          <>
            <Link to="/profile" style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              textDecoration: 'none', color: 'var(--color-primary-dark)',
              background: 'rgba(16, 185, 129, 0.1)', padding: '8px 16px', borderRadius: '20px',
              fontWeight: 600
            }}>
              👤 {user?.email?.split('@')[0]}
            </Link>
            {isAdmin && (
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <span className="text-gradient-accent" style={{ fontWeight: 600, padding: '0 8px' }}>
                  📊 Dashboard
                </span>
              </Link>
            )}
            <button onClick={logout} className="btn-premium" style={{ background: 'var(--gradient-dark)' }}>
              {t.navbar.logout}
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button className="btn-premium" style={{ background: 'transparent', color: 'var(--color-primary)', border: '2px solid var(--color-primary)' }}>
                {t.navbar.login}
              </button>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button className="btn-premium">
                {t.navbar.register}
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
