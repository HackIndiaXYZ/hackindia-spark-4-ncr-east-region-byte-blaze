import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
      }
    } catch (err) {
      // Clear corrupted localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setLoading(false);
  }, []);

  const register = async (email, password, role, walletAddress = null) => {
    try {
      setError(null);
      const response = await authAPI.register(email, password, role, walletAddress);

      // response is the full payload (success, data, message) because interceptor returns response.data
      const { data: { token: newToken, user: newUser } } = response;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed';
      setError(errorMsg);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login(email, password);

      // response is the full payload (success, data, message) because interceptor returns response.data
      const { data: { token: newToken, user: newUser } } = response;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed';
      setError(errorMsg);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';
  const isFarmer = user?.role === 'farmer';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isFarmer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
