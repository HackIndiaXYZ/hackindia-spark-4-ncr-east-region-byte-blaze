import React, { useState, useEffect } from 'react';
import { policyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const { isAuthenticated, isFarmer } = useAuth();

  useEffect(() => { fetchPolicies(); }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await policyAPI.getAll();
      setPolicies(response.data || []);
    } catch (err) {
      setError('Failed to load policies. Please ensure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (policyId, policyName, premium) => {
    if (!isAuthenticated) return alert('Please login to purchase a policy');
    if (!isFarmer) return alert('Only farmers can purchase policies');
    if (!window.confirm(`Purchase "${policyName}" for ₹${premium.toLocaleString('en-IN')}?`)) return;

    setPurchaseLoading(prev => ({ ...prev, [policyId]: true }));
    setSuccessMsg('');
    try {
      const response = await policyAPI.purchase(policyId);
      setSuccessMsg(`✅ ${response.message || 'Policy purchased successfully!'}`);
      // Refresh policies to reflect any changes
      await fetchPolicies();
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Purchase failed. Please try again.';
      alert(`❌ ${errMsg}`);
    } finally {
      setPurchaseLoading(prev => ({ ...prev, [policyId]: false }));
    }
  };

  const formatINR = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`;

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Hero */}
      <div style={{ 
        padding: '100px 24px', background: 'var(--gradient-dark)', color: 'white', textAlign: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h1 className="animate-fade-in-up" style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', color: 'white', marginBottom: '16px' }}>
            Agricultural <span className="text-gradient-accent">Coverage</span>
          </h1>
          <p className="animate-fade-in-up" style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', animationDelay: '0.1s' }}>
            Choose from our verified insurance plans to protect your harvest against unpredictable weather. All premiums in ₹ (INR).
          </p>
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.2) 0%, transparent 60%)', filter: 'blur(40px)' }}></div>
      </div>

      <div className="page-container" style={{ marginTop: '-40px', position: 'relative', zIndex: 20 }}>
        {error && (
          <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--color-error)', background: 'rgba(254, 242, 242, 0.9)', marginBottom: '32px' }}>
            ⚠️ {error}
          </div>
        )}

        {successMsg && (
          <div className="glass-panel animate-fade-in-up" style={{ padding: '20px', borderLeft: '4px solid var(--color-primary)', background: 'rgba(236, 253, 245, 0.9)', marginBottom: '32px', color: '#065f46' }}>
            {successMsg}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', fontSize: '1.5rem', color: 'var(--color-primary)', fontWeight: 600 }}>
            <div className="animate-float">⏳ Loading Policies...</div>
          </div>
        ) : policies.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
            {policies.map((policy, idx) => (
              <div key={policy.id} className="glass-panel animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s`, display: 'flex', flexDirection: 'column', transition: 'all 0.4s ease', overflow: 'hidden' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-12px)'; e.currentTarget.style.boxShadow = 'var(--shadow-xl)'; e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'; }}
              >
                {/* Header */}
                <div style={{ padding: '32px 24px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(255,255,255,0) 100%)', borderBottom: '1px solid var(--color-border)' }}>
                  <div className="badge" style={{ marginBottom: '16px' }}>Active Plan</div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary-dark)' }}>{policy.name}</h3>
                </div>

                {/* Body */}
                <div style={{ padding: '24px', flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px dashed var(--color-border)' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>PREMIUM</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-main)' }}>{formatINR(policy.premium)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>COVERAGE</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)' }}>{formatINR(policy.payout)}</div>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', marginBottom: '8px' }}>
                      <strong>🌧️ Rainfall Threshold:</strong> {policy.rainfall_threshold} mm
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                      <strong>🌡️ Temp Range:</strong> {policy.temperature_min}°C to {policy.temperature_max}°C
                    </div>
                  </div>

                  <button 
                    onClick={() => handlePurchase(policy.id, policy.name, policy.premium)}
                    className="btn-premium"
                    disabled={!isAuthenticated || !isFarmer || purchaseLoading[policy.id]}
                    style={{ 
                      width: '100%', 
                      opacity: (!isAuthenticated || !isFarmer) ? 0.5 : 1,
                      cursor: (!isAuthenticated || !isFarmer) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {purchaseLoading[policy.id] ? 'Processing...' : (!isAuthenticated ? 'Login to Purchase' : `Buy for ${formatINR(policy.premium)}`)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>No policies available right now.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Policies;
