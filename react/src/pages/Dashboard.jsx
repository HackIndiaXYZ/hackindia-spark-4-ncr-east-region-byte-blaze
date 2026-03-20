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
    name: '',
    premium: '',
    payout: '',
    rainfallThreshold: '',
    temperatureMin: '',
    temperatureMax: '',
  });

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const statsRes = await adminAPI.getDashboardStats();
      const policiesRes = await policyAPI.getAll();
      const usersRes = await adminAPI.getAllUsers(100, 0);

      setDashStats(statsRes.data);
      setPolicies(policiesRes.data || []);
      setAllUsers(usersRes.data || []);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPolicy(prev => ({
      ...prev,
      [name]: name.includes('Threshold') || name.includes('Min') || name.includes('Max') ? parseInt(value) : value,
    }));
  };

  const handleCreatePolicy = async (e) => {
    e.preventDefault();
    setCreatingPolicy(true);

    try {
      // Convert numbers to BigInt strings for Wei
      const policyData = {
        name: newPolicy.name,
        premium: (parseFloat(newPolicy.premium) * 10 ** 18).toString(),
        payout: (parseFloat(newPolicy.payout) * 10 ** 18).toString(),
        rainfallThreshold: parseInt(newPolicy.rainfallThreshold),
        temperatureMin: parseInt(newPolicy.temperatureMin),
        temperatureMax: parseInt(newPolicy.temperatureMax),
      };

      const response = await adminAPI.createPolicy(policyData);
      alert(`Policy created successfully! TX: ${response.data.txHash}`);
      setShowCreateForm(false);
      setNewPolicy({
        name: '',
        premium: '',
        payout: '',
        rainfallThreshold: '',
        temperatureMin: '',
        temperatureMax: '',
      });
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create policy');
    } finally {
      setCreatingPolicy(false);
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

  if (!isAdmin) {
    return (
      <div className="section">
        <div className="container">
          <div className="alert alert-error">
            You don't have permission to access the admin dashboard.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>📊 Admin Dashboard</h1>
          <p>Manage policies, view analytics, and monitor the platform</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {error && <div className="alert alert-error">{error}</div>}

          {/* Stats Cards */}
          <div className="grid-3">
            <div className="card">
              <h4>📋 Total Policies Available</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                {dashStats?.totalPoliciesAvailable || 0}
              </div>
            </div>
            <div className="card">
              <h4>🛒 Total Policies Sold</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                {dashStats?.totalPoliciesSold || 0}
              </div>
            </div>
            <div className="card">
              <h4>👥 Total Users</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                {dashStats?.totalUsers || 0}
              </div>
            </div>
            <div className="card">
              <h4>🌾 Farmers</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary)' }}>
                {dashStats?.farmerCount || 0}
              </div>
            </div>
            <div className="card">
              <h4>⚙️ Admins</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary)' }}>
                {dashStats?.adminCount || 0}
              </div>
            </div>
            <div className="card">
              <h4>💰 Total Payouts</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                {(dashStats?.totalPayouts / 10 ** 18 || 0).toFixed(2)} ETH
              </div>
            </div>
          </div>

          {/* Create Policy Section */}
          <div className="card" style={{ marginTop: '2rem' }}>
            <h3>➕ Create New Policy</h3>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              {showCreateForm ? 'Cancel' : 'Create Policy'}
            </button>

            {showCreateForm && (
              <form onSubmit={handleCreatePolicy} style={{ marginTop: '1.5rem' }}>
                <div className="form-group">
                  <label>Policy Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newPolicy.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Rainfall Insurance Premium"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Premium (ETH)</label>
                    <input
                      type="number"
                      name="premium"
                      value={newPolicy.premium}
                      onChange={handleInputChange}
                      placeholder="0.5"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Payout (ETH)</label>
                    <input
                      type="number"
                      name="payout"
                      value={newPolicy.payout}
                      onChange={handleInputChange}
                      placeholder="5.0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Rainfall Threshold (mm)</label>
                    <input
                      type="number"
                      name="rainfallThreshold"
                      value={newPolicy.rainfallThreshold}
                      onChange={handleInputChange}
                      placeholder="100"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Min Temperature (°C)</label>
                    <input
                      type="number"
                      name="temperatureMin"
                      value={newPolicy.temperatureMin}
                      onChange={handleInputChange}
                      placeholder="-10"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Max Temperature (°C)</label>
                    <input
                      type="number"
                      name="temperatureMax"
                      value={newPolicy.temperatureMax}
                      onChange={handleInputChange}
                      placeholder="40"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creatingPolicy}
                >
                  {creatingPolicy ? 'Creating...' : 'Create Policy'}
                </button>
              </form>
            )}
          </div>

          {/* All Policies */}
          <div className="card" style={{ marginTop: '2rem' }}>
            <h3>All Policies ({policies.length})</h3>
            {policies.length > 0 ? (
              <div className="grid-3" style={{ marginTop: '1rem' }}>
                {policies.map(policy => (
                  <div key={policy.id} className="card" style={{ marginTop: '0' }}>
                    <h4>{policy.name}</h4>
                    <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                      <p><strong>Premium:</strong> {(policy.premium / 10 ** 18).toFixed(2)} ETH</p>
                      <p><strong>Payout:</strong> {(policy.payout / 10 ** 18).toFixed(2)} ETH</p>
                      <p><strong>Rain Threshold:</strong> {policy.rainfall_threshold} mm</p>
                      <p><strong>Temp Range:</strong> {policy.temperature_min}°C to {policy.temperature_max}°C</p>
                      <p><strong>Status:</strong> <span className="policy-badge">{policy.active ? 'Active' : 'Inactive'}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ marginTop: '1rem' }}>No policies created yet.</p>
            )}
          </div>

          {/* Users List */}
          <div className="card" style={{ marginTop: '2rem' }}>
            <h3>Users List ({allUsers.length})</h3>
            {allUsers.length > 0 ? (
              <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Wallet</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.email || '-'}</td>
                        <td><span className="policy-badge">{user.role}</span></td>
                        <td style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>
                          {user.wallet_address?.substring(0, 15)}...
                        </td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ marginTop: '1rem' }}>No users found</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
