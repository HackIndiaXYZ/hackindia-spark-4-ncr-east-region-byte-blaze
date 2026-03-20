import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout,isAdmin, isFarmer } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🌾 InsuChain
        </Link>
        <ul className="navbar-nav">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/policies">Policies</Link></li>
          <li><Link to="/how-it-works">How It Works</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          
          {isAuthenticated ? (
            <>
              <li><Link to="/profile">👤 {user?.email}</Link></li>
              {isAdmin && <li><Link to="/dashboard">📊 Dashboard</Link></li>}
              <li><button onClick={handleLogout} className="btn btn-danger">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="btn btn-primary">Login</Link></li>
              <li><Link to="/register" className="btn btn-secondary">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
