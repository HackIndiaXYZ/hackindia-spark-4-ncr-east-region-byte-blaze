import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { colors, spacing, borderRadius, transitions, commonStyles } from '../styles/constants';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'farmer',
    walletAddress: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(''); // Clear error when user starts typing
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      setSuccess(t.auth.loginSuccess);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || t.auth.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError(t.auth.passwordMismatch);
      setLoading(false);
      return;
    }

    try {
      await register(
        formData.email,
        formData.password,
        formData.role,
        formData.role === 'farmer' ? formData.walletAddress : null
      );
      setSuccess(t.auth.registerSuccess);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || t.auth.registerFailed);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFocusedField(null);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      role: 'farmer',
      walletAddress: '',
    });
  };

  // Styles using constants
  const containerStyle = {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    paddingLeft: spacing.base,
    paddingRight: spacing.base,
    backgroundColor: colors.bg.light,
  };

  const cardStyle = {
    backgroundColor: colors.bg.white,
    borderRadius: borderRadius.lg,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    padding: `${spacing.lg} ${spacing.lg}`,
    maxWidth: '450px',
    width: '100%',
    border: `1px solid ${colors.borderLight}`,
  };

  const titleStyle = {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: colors.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
    margin: `0 0 ${spacing.sm} 0`,
  };

  const subtitleStyle = {
    fontSize: '0.95rem',
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  };

  const formGroupStyle = {
    marginBottom: spacing.md,
  };

  const labelStyle = {
    display: 'block',
    marginBottom: spacing.sm,
    fontWeight:600,
    color: colors.text.primary,
    fontSize: '0.95rem',
  };

  const inputStyle = {
    width: '100%',
    padding: `${spacing.sm} ${spacing.base}`,
    border: `1.5px solid ${colors.border}`,
    borderRadius: borderRadius.base,
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: transitions.base,
    boxSizing: 'border-box',
    backgroundColor: colors.bg.white,
  };

  const inputFocusStyle = {
    borderColor: colors.primary,
    boxShadow: `0 0 0 3px rgba(27, 94, 32, 0.1)`,
    outline: 'none',
  };

  const submitButtonStyle = {
    width: '100%',
    padding: `${spacing.sm} ${spacing.md}`,
    backgroundColor: colors.primary,
    color: colors.bg.white,
    border: 'none',
    borderRadius: borderRadius.base,
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: transitions.base,
    marginTop: spacing.base,
    ...(loading && { opacity: 0.6, cursor: 'not-allowed' }),
  };

  const toggleButtonStyle = {
    background: 'none',
    border: 'none',
    color: colors.primary,
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: transitions.base,
    padding: 0,
  };

  const toggleContainerStyle = {
    textAlign: 'center',
    marginTop: spacing.md,
    fontSize: '0.95rem',
    color: colors.text.secondary,
  };

  const smallTextStyle = {
    fontSize: '0.8rem',
    color: colors.text.secondary,
    marginTop: spacing.sm,
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={cardStyle}>
        <h2 style={titleStyle}>
          {isLogin ? '🔓 ' : '✨ '}
          {isLogin ? t.auth.loginTitle : t.auth.registerTitle}
        </h2>
        <p style={subtitleStyle}>
          {isLogin ? t.auth.switchToRegister : t.auth.switchToLogin}
        </p>

        {error && <div style={commonStyles.alert('error')}>{error}</div>}
        {success && <div style={commonStyles.alert('success')}>{success}</div>}

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          {/* Email Field */}
          <div style={formGroupStyle}>
            <label htmlFor="email" style={labelStyle}>
              ✉️ {t.auth.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              style={{
                ...inputStyle,
                ...(focusedField === 'email' ? inputFocusStyle : {}),
              }}
              placeholder={t.auth.emailPlaceholder}
              required
              disabled={loading}
            />
          </div>

          {/* Role Selector (Register only) */}
          {!isLogin && (
            <div style={formGroupStyle}>
              <label htmlFor="role" style={labelStyle}>
                👤 {t.auth.roleLabel}
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('role')}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...inputStyle,
                  ...(focusedField === 'role' ? inputFocusStyle : {}),
                }}
                required
                disabled={loading}
              >
                <option value="farmer">🌾 {t.auth.farmer}</option>
                <option value="admin">⚙️ {t.auth.admin}</option>
              </select>
            </div>
          )}

          {/* Wallet Address (Register + Farmer only) */}
          {!isLogin && formData.role === 'farmer' && (
            <div style={formGroupStyle}>
              <label htmlFor="wallet" style={labelStyle}>
                🔗 {t.auth.walletLabel}
              </label>
              <input
                id="wallet"
                type="text"
                name="walletAddress"
                value={formData.walletAddress}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('wallet')}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...inputStyle,
                  ...(focusedField === 'wallet' ? inputFocusStyle : {}),
                }}
                placeholder={t.auth.walletPlaceholder}
                disabled={loading}
              />
              <small style={smallTextStyle}>💡 {t.auth.walletHint}</small>
            </div>
          )}

          {/* Password Field */}
          <div style={formGroupStyle}>
            <label htmlFor="password" style={labelStyle}>
              🔒 {t.auth.passwordLabel}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              style={{
                ...inputStyle,
                ...(focusedField === 'password' ? inputFocusStyle : {}),
              }}
              placeholder={t.auth.passwordPlaceholder}
              required
              minLength="6"
              disabled={loading}
            />
          </div>

          {/* Confirm Password (Register only) */}
          {!isLogin && (
            <div style={formGroupStyle}>
              <label htmlFor="confirmPassword" style={labelStyle}>
                🔐 {t.auth.confirmPasswordLabel}
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...inputStyle,
                  ...(focusedField === 'confirmPassword' ? inputFocusStyle : {}),
                }}
                placeholder={t.auth.passwordPlaceholder}
                required
                minLength="6"
                disabled={loading}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            style={submitButtonStyle}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = colors.primaryDark;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 20px rgba(27, 94, 32, 0.3)`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {loading ? '⏳ ' + t.common.loading : (isLogin ? '🔓 ' + t.auth.loginBtn : '✨ ' + t.auth.registerBtn)}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div style={toggleContainerStyle}>
          <span>
            {isLogin ? t.auth.switchToRegister : t.auth.switchToLogin}
            {' '}
          </span>
          <button
            onClick={toggleMode}
            style={toggleButtonStyle}
            type="button"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.primaryDark;
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.primary;
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            {isLogin ? t.auth.registerHere : t.auth.loginHere}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
