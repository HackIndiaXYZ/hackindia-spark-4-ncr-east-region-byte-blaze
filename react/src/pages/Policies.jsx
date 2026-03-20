import React, { useState, useEffect } from 'react';
import { policyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  const { isAuthenticated, isFarmer } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await policyAPI.getAll();
      setPolicies(response.data || []);
    } catch (err) {
      setError('Failed to load policies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (policyId, premium) => {
    if (!isAuthenticated) {
      alert('Please login to purchase a policy');
      return;
    }

    if (!isFarmer) {
      alert('Only farmers can purchase policies');
      return;
    }

    if (!window.confirm(`${t.policies.confirmPurchase} ${premium / 10 ** 18} ETH?`)) {
      return;
    }

    setPurchaseLoading(prev => ({ ...prev, [policyId]: true }));

    try {
      const response = await policyAPI.purchase(policyId, premium);
      alert(`✅ ${t.policies.purchaseBtn}! Tx: ${response.data.txHash}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Purchase failed');
    } finally {
      setPurchaseLoading(prev => ({ ...prev, [policyId]: false }));
    }
  };

  const heroStyle = {
    background: 'linear-gradient(135deg, #1B5E20 0%, #2d7a2d 100%)',
    color: '#ffffff',
    paddingTop: '100px',
    paddingBottom: '100px',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    textAlign: 'center',
    marginBottom: '3rem',
  };

  const heroTitleStyle = {
    fontSize: 'clamp(2.5rem, 8vw, 3.2rem)',
    fontWeight: 800,
    marginBottom: '1rem',
    letterSpacing: '-0.5px',
  };

  const heroSubtitleStyle = {
    fontSize: '1.2rem',
    opacity: 0.95,
    fontWeight: 400,
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    paddingBottom: '5rem',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2.5rem',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #f0f0f0',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    display: 'flex',
    flexDirection: 'column',
  };

  const cardHeaderStyle = {
    backgroundColor: 'linear-gradient(135deg, #1B5E20 0%, #2d7a2d 100%)',
    background: 'linear-gradient(135deg, #1B5E20 0%, #2d7a2d 100%)',
    color: '#ffffff',
    padding: '2rem',
    borderBottom: '3px solid #FFA500',
  };

  const cardBodyStyle = {
    padding: '2rem',
    flexGrow: 1,
  };

  const cardFooterStyle = {
    padding: '1.5rem 2rem',
    backgroundColor: '#fafafa',
    borderTop: '1px solid #f0f0f0',
  };

  const policyNameStyle = {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
  };

  const badgeStyle = {
    display: 'inline-block',
    backgroundColor: '#FFA500',
    color: '#1B5E20',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 700,
    marginTop: '0.5rem',
  };

  const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid #f0f0f0',
  };

  const infoItemStyle = {
    textAlign: 'center',
  };

  const infoLabelStyle = {
    fontSize: '0.85rem',
    color: '#6b7280',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '0.5rem',
  };

  const infoValueStyle = {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#1B5E20',
  };

  const specItemStyle = {
    marginBottom: '1rem',
    fontSize: '0.95rem',
    color: '#374151',
    lineHeight: 1.6,
  };

  const specLabelStyle = {
    fontWeight: 600,
    color: '#1f2937',
  };

  const coverageBoxStyle = {
    backgroundColor: '#f0fdf4',
    border: '1px solid #dcfce7',
    borderRadius: '10px',
    padding: '1rem',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
    color: '#166534',
    lineHeight: 1.6,
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.875rem 1.5rem',
    backgroundColor: '#1B5E20',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#145a1f',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(27, 94, 32, 0.3)',
  };

  const buttonDisabledStyle = {
    backgroundColor: '#d1d5db',
    cursor: 'not-allowed',
    transform: 'none',
  };

  const loadingSpinnerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    fontSize: '1.2rem',
    color: '#1B5E20',
  };

  if (loading) {
    return (
      <div>
        <div style={heroStyle}>
          <h1 style={heroTitleStyle}>{t.policies.title}</h1>
          <p style={heroSubtitleStyle}>{t.policies.subtitle}</p>
        </div>
        <div style={containerStyle}>
          <div style={loadingSpinnerStyle}>⏳ {t.common.loading}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div style={heroStyle}>
        <h1 style={heroTitleStyle}>{t.policies.title}</h1>
        <p style={heroSubtitleStyle}>{t.policies.subtitle}</p>
      </div>

      {/* Content Section */}
      <div style={containerStyle}>
        {error && (
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              color: '#991b1b',
              marginBottom: '2rem',
              fontWeight: 500,
            }}
          >
            ❌ {error}
          </div>
        )}

        {policies.length > 0 ? (
          <div style={gridStyle}>
            {policies.map((policy) => (
              <div
                key={policy.id}
                style={{
                  ...cardStyle,
                  ...(hoveredCard === policy.id ? {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    borderColor: '#1B5E20',
                  } : {}),
                }}
                onMouseEnter={() => setHoveredCard(policy.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Header */}
                <div style={cardHeaderStyle}>
                  <h3 style={policyNameStyle}>{policy.name}</h3>
                  <div style={badgeStyle}>✓ Active</div>
                </div>

                {/* Card Body */}
                <div style={cardBodyStyle}>
                  {/* Premium & Payout Info */}
                  <div style={infoGridStyle}>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>{t.policies.premium}</div>
                      <div style={infoValueStyle}>
                        {(policy.premium / 10 ** 18).toFixed(2)} ETH
                      </div>
                    </div>
                    <div style={infoItemStyle}>
                      <div style={infoLabelStyle}>{t.policies.payout}</div>
                      <div style={infoValueStyle}>
                        {(policy.payout / 10 ** 18).toFixed(2)} ETH
                      </div>
                    </div>
                  </div>

                  {/* Coverage Info */}
                  <div style={coverageBoxStyle}>
                    <strong>ℹ️ {t.policies.coverage}</strong>
                    <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                      {t.policies.coverageDesc}
                    </p>
                  </div>

                  {/* Specifications */}
                  <div style={specItemStyle}>
                    <span style={specLabelStyle}>{t.policies.rainfallThreshold}:</span>
                    <br />
                    {policy.rainfall_threshold} mm
                  </div>
                  <div style={specItemStyle}>
                    <span style={specLabelStyle}>{t.policies.temperatureRange}:</span>
                    <br />
                    {policy.temperature_min}°C to {policy.temperature_max}°C
                  </div>
                </div>

                {/* Card Footer */}
                <div style={cardFooterStyle}>
                  {isAuthenticated && isFarmer ? (
                    <button
                      onClick={() => handlePurchase(policy.id, policy.premium)}
                      style={{
                        ...buttonStyle,
                        ...(purchaseLoading[policy.id] ? buttonDisabledStyle : {}),
                      }}
                      disabled={purchaseLoading[policy.id]}
                      onMouseEnter={(e) => {
                        if (!purchaseLoading[policy.id]) {
                          Object.assign(e.currentTarget.style, buttonHoverStyle);
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#1B5E20';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {purchaseLoading[policy.id] ? '⏳ ' + t.policies.purchasing : '🛒 ' + t.policies.purchaseBtn}
                    </button>
                  ) : (
                    <button
                      style={{
                        ...buttonStyle,
                        ...buttonDisabledStyle,
                        backgroundColor: '#e5e7eb',
                        color: '#6b7280',
                      }}
                      disabled
                    >
                      {!isAuthenticated ? '🔒 ' + t.policies.loginToPurchase : t.policies.notAvailable}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '2px dashed #e5e7eb',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📭</div>
            <p style={{ fontSize: '1.1rem', color: '#6b7280', fontWeight: 500 }}>
              {t.policies.noPolicies}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Policies;
