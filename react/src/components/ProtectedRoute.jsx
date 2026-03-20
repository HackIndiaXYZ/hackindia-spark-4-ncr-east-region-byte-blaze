import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false, requireFarmer = false }) => {
  const { isAuthenticated, isAdmin, isFarmer, loading } = useAuth();

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  if (requireFarmer && !isFarmer) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
