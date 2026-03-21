import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { weatherAPI } from '../services/api';

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // Get user's location and fetch weather
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await weatherAPI.getByLocation(pos.coords.latitude, pos.coords.longitude);
            if (res.success) setWeather(res.data);
          } catch (e) { console.warn('Weather fetch failed'); }
        },
        () => {
          // Fallback to Delhi
          weatherAPI.getByLocation(28.7041, 77.1025)
            .then(res => { if (res.success) setWeather(res.data); })
            .catch(() => {});
        }
      );
    }
  }, []);

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? 'var(--color-primary)' : 'var(--color-text-muted)',
    fontWeight: isActive(path) ? 700 : 500,
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: 'var(--radius-full)',
    border: isActive(path) ? '1px solid var(--color-primary)' : '1px solid transparent',
    transition: 'all 0.2s ease',
    fontSize: '0.95rem',
  });

  return (
    <nav className="modern-nav">
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.6rem' }}>🌾</span>
        <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.3rem', color: 'var(--color-primary)' }}>InsuChain</span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Link to="/" style={linkStyle('/')}>Home</Link>
        <Link to="/policies" style={linkStyle('/policies')}>Policies</Link>
        <Link to="/how-it-works" style={linkStyle('/how-it-works')}>How It Works</Link>
        <Link to="/faq" style={linkStyle('/faq')}>FAQ</Link>
        <Link to="/contact" style={linkStyle('/contact')}>Contact</Link>
        <Link to="/weather" style={linkStyle('/weather')}>🌦️ Weather</Link>
      </div>

      {/* Right side: Weather + Auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Weather Widget */}
        {weather && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', borderRadius: 'var(--radius-full)',
            background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16,185,129,0.2)',
            fontSize: '0.85rem', color: 'var(--color-text-main)', fontWeight: 500
          }}>
            <span style={{ fontSize: '1.1rem' }}>
              {weather.description?.includes('rain') ? '🌧️' :
               weather.description?.includes('cloud') ? '☁️' :
               weather.description?.includes('clear') ? '☀️' :
               weather.description?.includes('storm') ? '⛈️' :
               weather.description?.includes('snow') ? '❄️' : '🌤️'}
            </span>
            <span>{Math.round(weather.temperature)}°C</span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{weather.location}</span>
          </div>
        )}

        {isAuthenticated ? (
          <>
            {isAdmin && (
              <Link to="/dashboard" style={linkStyle('/dashboard')}>⚙️ Admin</Link>
            )}
            {!isAdmin && (
              <Link to="/profile" style={linkStyle('/profile')}>👤 {user?.email?.split('@')[0]}</Link>
            )}
            <button onClick={logout} className="btn-premium" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-premium" style={{ padding: '8px 20px', fontSize: '0.9rem', textDecoration: 'none' }}>
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
