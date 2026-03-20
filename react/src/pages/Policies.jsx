import React, { useState, useEffect } from 'react';
import { policyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Policiespage = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState({});
  const { isAuthenticated, isFarmer } = useAuth();

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await policyAPI.getAll();
      setPolicies(response.data || []);
    } catch (err) {
      setError('Failed to load policies. Please try again later.');
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

    if (!window.confirm(`Purchase this policy for ${premium / 10 ** 18} ETH?`)) {
      return;
    }

    setPurchaseLoading(prev => ({ ...prev, [policyId]: true }));

    try {
      const response = await policyAPI.purchase(policyId, premium);
      alert(`Policy purchased successfully! Tx: ${response.data.txHash}`);
      // Optionally refresh the page or update state
    } catch (err) {
      alert(err.response?.data?.error || 'Purchase failed. Please try again.');
    } finally {
      setPurchaseLoading(prev => ({ ...prev, [policyId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>🛡️ Insurance Policies</h1>
          <p>Choose the best protection plan for your farm</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="grid-3">
            {policies.map(policy => (
              <div key={policy.id} className="card policy-card">
                <div className="card-header">
                  <div>
                    <h3>{policy.name}</h3>
                    <span className="policy-badge">Active</span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="policy-info">
                    <div className="policy-info-item">
                      <div className="policy-info-label">Premium</div>
                      <div className="policy-info-value">
                        {(policy.premium / 10 ** 18).toFixed(2)} ETH
                      </div>
                    </div>
                    <div className="policy-info-item">
                      <div className="policy-info-label">Payout</div>
                      <div className="policy-info-value">
                        {(policy.payout / 10 ** 18).toFixed(2)} ETH
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <p><strong>🌧️ Rainfall Threshold:</strong> {policy.rainfall_threshold} mm</p>
                    <p><strong>🌡️ Temperature Range:</strong> {policy.temperature_min}°C to {policy.temperature_max}°C</p>
                  </div>

                  <div style={{
                    background: '#f3f4f6',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.9rem',
                    marginBottom: '1rem'
                  }}>
                    <p><strong>Coverage:</strong> Automatically triggered when weather conditions match the policy thresholds.</p>
                  </div>
                </div>

                <div className="card-footer">
                  {isAuthenticated && isFarmer ? (
                    <button
                      onClick={() => handlePurchase(policy.id, policy.premium)}
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                      disabled={purchaseLoading[policy.id]}
                    >
                      {purchaseLoading[policy.id] ? 'Purchasing...' : 'Purchase Policy'}
                    </button>
                  ) : (
                    <button className="btn btn-outline" style={{ width: '100%' }} disabled>
                      {!isAuthenticated ? 'Login to Purchase' : 'Not Available'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {policies.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No policies available at the moment. Please check back later.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Policiespage;
