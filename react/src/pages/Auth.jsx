import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'farmer',
    walletAddress: '',
  });

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      setSuccess(t.auth.loginSuccess);
      setTimeout(() => navigate('/'), 1000);
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
      await register(formData.email, formData.password, formData.role, formData.role === 'farmer' ? formData.walletAddress : null);
      setSuccess(t.auth.registerSuccess);
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setError(err.response?.data?.error || t.auth.registerFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(circle at center, #f8fafc 0%, #e2e8f0 100%)', padding: '40px 20px', position: 'relative', overflow: 'hidden'
    }}>
      {/* Decorative Orbs */}
      <div className="animate-float" style={{ position: 'absolute', top: '10%', left: '15%', width: '300px', height: '300px', borderRadius: '50%', background: 'var(--gradient-primary)', opacity: 0.1, filter: 'blur(60px)' }}></div>
      <div className="animate-float" style={{ position: 'absolute', bottom: '10%', right: '15%', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--gradient-accent)', opacity: 0.08, filter: 'blur(80px)', animationDelay: '2s' }}></div>

      <div className="glass-panel animate-fade-in-up" style={{ 
        width: '100%', maxWidth: '480px', padding: '48px 40px', position: 'relative', zIndex: 10,
        boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.15)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            <span className="text-gradient">{isLogin ? 'Welcome Back' : 'Join InsuChain'}</span>
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            {isLogin ? 'Secure access to your agricultural portfolio.' : 'Start protecting your harvest with smart contracts.'}
          </p>
        </div>

        {error && <div style={{ padding: '12px 16px', background: '#fef2f2', color: '#991b1b', borderRadius: '8px', marginBottom: '24px', borderLeft: '4px solid #ef4444' }}>{error}</div>}
        {success && <div style={{ padding: '12px 16px', background: '#ecfdf5', color: '#065f46', borderRadius: '8px', marginBottom: '24px', borderLeft: '4px solid #10b981' }}>{success}</div>}

        <form onSubmit={isLogin ? handleLogin : handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="premium-label">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="premium-input" placeholder="you@example.com" required disabled={loading} />
          </div>

          {!isLogin && (
            <div>
              <label className="premium-label">Account Type</label>
              <select name="role" value={formData.role} onChange={handleInputChange} className="premium-input" required disabled={loading}>
                <option value="farmer">🌾 Farmer (Requires Wallet)</option>
                <option value="admin">⚙️ Administrator</option>
              </select>
            </div>
          )}

          {!isLogin && formData.role === 'farmer' && (
            <div className="animate-fade-in-up" style={{ animationDuration: '0.4s' }}>
              <label className="premium-label">Ethereum Wallet Address</label>
              <input type="text" name="walletAddress" value={formData.walletAddress} onChange={handleInputChange} className="premium-input" placeholder="0x..." disabled={loading} />
            </div>
          )}

          <div>
            <label className="premium-label">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="premium-input" placeholder="••••••••" required minLength="6" disabled={loading} />
          </div>

          {!isLogin && (
            <div className="animate-fade-in-up" style={{ animationDuration: '0.4s', animationDelay: '0.1s' }}>
              <label className="premium-label">Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="premium-input" placeholder="••••••••" required minLength="6" disabled={loading} />
            </div>
          )}

          <button type="submit" className="btn-premium" style={{ width: '100%', marginTop: '12px', padding: '16px' }} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In Securely' : 'Create Account')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px', color: 'var(--color-text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }} 
            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter', fontSize: '1rem' }}
          >
            {isLogin ? 'Register Here' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
