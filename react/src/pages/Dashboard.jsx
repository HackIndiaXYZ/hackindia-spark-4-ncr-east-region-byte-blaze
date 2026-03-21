import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI, policyAPI } from '../services/api';

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [dashStats, setDashStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creatingPolicy, setCreatingPolicy] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const [newPolicy, setNewPolicy] = useState({
    name: '', premium: '', payout: '', rainfallThreshold: '', temperatureMin: '', temperatureMax: '',
  });

  useEffect(() => {
    if (isAdmin) loadDashboardData();
    else setLoading(false);
  }, [isAdmin]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsRes, policiesRes, usersRes] = await Promise.all([
        adminAPI.getDashboardStats(), policyAPI.getAll(), adminAPI.getAllUsers(100, 0),
      ]);
      setDashStats(statsRes.data || {});
      setPolicies(policiesRes.data || []);
      setAllUsers(usersRes.data || []);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value === '') { setNewPolicy(prev => ({ ...prev, [name]: '' })); return; }
    setNewPolicy(prev => ({
      ...prev,
      [name]: name.includes('Threshold') || name.includes('Min') || name.includes('Max') ? Number(value) : value,
    }));
  };

  const handleCreatePolicy = async (e) => {
    e.preventDefault();
    if (creatingPolicy) return;
    setCreatingPolicy(true);
    try {
      const premiumNum = Number(newPolicy.premium);
      const payoutNum = Number(newPolicy.payout);
      if (Number.isNaN(premiumNum) || Number.isNaN(payoutNum)) {
        alert('Premium and payout must be valid numbers'); return;
      }
      const response = await adminAPI.createPolicy({
        name: newPolicy.name.trim(), premium: Math.floor(premiumNum * 10 ** 18).toString(),
        payout: Math.floor(payoutNum * 10 ** 18).toString(), rainfallThreshold: Number(newPolicy.rainfallThreshold),
        temperatureMin: Number(newPolicy.temperatureMin), temperatureMax: Number(newPolicy.temperatureMax),
      });
      alert(`Policy created successfully!`);
      setShowCreateForm(false);
      setNewPolicy({ name: '', premium: '', payout: '', rainfallThreshold: '', temperatureMin: '', temperatureMax: '' });
      await loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create policy');
    } finally {
      setCreatingPolicy(false);
    }
  };

  if (loading) return <div style={{ padding: '80px', textAlign: 'center', fontSize: '1.5rem' }}>⏳ Loading Dashboard...</div>;
  if (!isAdmin) return <div style={{ padding: '80px', textAlign: 'center', color: 'red' }}>🚀 Unauthorized Access</div>;

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Hero */}
      <div style={{ padding: '80px 24px', background: 'var(--gradient-dark)', color: 'white', textAlign: 'center' }}>
        <h1 className="animate-fade-in-up" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'white', margin: 0 }}>📊 Admin <span className="text-gradient-accent">Dashboard</span></h1>
      </div>

      <div className="page-container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        {error && <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--color-error)', background: 'rgba(254,242,242,0.9)', color: 'var(--color-error)', marginBottom: '32px' }}>⚠️ {error}</div>}

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {[
            { emoji: '📋', label: 'Total Policies', value: dashStats?.totalPoliciesAvailable || 0 },
            { emoji: '🛒', label: 'Policies Sold', value: dashStats?.totalPoliciesSold || 0 },
            { emoji: '👥', label: 'Total Users', value: dashStats?.totalUsers || 0 },
            { emoji: '🌾', label: 'Farmers', value: dashStats?.farmerCount || 0 },
            { emoji: '💰', label: 'Total Payouts', value: `₹${((dashStats?.totalPayouts || 0)).toLocaleString('en-IN')}` },
          ].map((stat, idx) => (
            <div key={idx} className="glass-panel animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s`, padding: '24px', textAlign: 'center', transition: 'all 0.3s' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{stat.emoji}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Create Policy */}
        <div className="glass-panel" style={{ padding: '32px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>➕ Create New Policy</h3>
            <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-premium" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              {showCreateForm ? '✕ Cancel' : '✓ Create Policy'}
            </button>
          </div>

          {showCreateForm && (
            <form onSubmit={handleCreatePolicy} className="animate-fade-in-up" style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label className="premium-label">Policy Name</label>
                <input type="text" name="name" value={newPolicy.name} onChange={handleInputChange} className="premium-input" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {['premium', 'payout', 'rainfallThreshold', 'temperatureMin', 'temperatureMax'].map(field => (
                  <div key={field}>
                    <label className="premium-label" style={{ textTransform: 'capitalize' }}>{field.replace(/([A-Z])/g, ' $1')}</label>
                    <input type="number" name={field} value={newPolicy[field]} onChange={handleInputChange} className="premium-input" step={field==='premium'||field==='payout'?'0.01':'1'} required />
                  </div>
                ))}
              </div>
              <button type="submit" className="btn-premium" disabled={creatingPolicy} style={{ background: 'var(--gradient-accent)' }}>
                {creatingPolicy ? 'Creating...' : 'Submit Policy'}
              </button>
            </form>
          )}
        </div>

        {/* Users Table */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>👥 Platform Users ({allUsers.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                  <th style={{ padding: '16px', color: 'var(--color-primary)' }}>Email</th>
                  <th style={{ padding: '16px', color: 'var(--color-primary)' }}>Role</th>
                  <th style={{ padding: '16px', color: 'var(--color-primary)' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)', background: i%2===0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                    <td style={{ padding: '16px' }}>{u.email}</td>
                    <td style={{ padding: '16px' }}>
                      <span className="badge" style={{ background: u.role==='admin'?'var(--color-accent)':'var(--color-primary)' }}>{u.role.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '16px' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;