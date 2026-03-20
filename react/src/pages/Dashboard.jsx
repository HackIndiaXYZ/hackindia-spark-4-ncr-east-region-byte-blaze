import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { adminAPI, policyAPI } from '../services/api';

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage(); // currently unused, but kept for future i18n
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
    } else {
      // non-admin: stop loading and show message
      setLoading(false);
    }
  }, [isAdmin]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [statsRes, policiesRes, usersRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        policyAPI.getAll(),
        adminAPI.getAllUsers(100, 0),
      ]);

      setDashStats(statsRes.data || {});
      setPolicies(policiesRes.data || []);
      setAllUsers(usersRes.data || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // allow empty input without converting to NaN
    if (value === '') {
      setNewPolicy((prev) => ({ ...prev, [name]: '' }));
      return;
    }

    setNewPolicy((prev) => ({
      ...prev,
      [name]:
        name.includes('Threshold') ||
        name.includes('Min') ||
        name.includes('Max')
          ? Number(value)
          : value,
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
        alert('Premium and payout must be valid numbers');
        setCreatingPolicy(false);
        return;
      }

      const policyData = {
        name: newPolicy.name.trim(),
        premium: Math.floor(premiumNum * 10 ** 18).toString(),
        payout: Math.floor(payoutNum * 10 ** 18).toString(),
        rainfallThreshold: Number(newPolicy.rainfallThreshold),
        temperatureMin: Number(newPolicy.temperatureMin),
        temperatureMax: Number(newPolicy.temperatureMax),
      };

      const response = await adminAPI.createPolicy(policyData);
      alert(`Policy created successfully! TX: ${response.data?.txHash || 'N/A'}`);

      setShowCreateForm(false);
      setNewPolicy({
        name: '',
        premium: '',
        payout: '',
        rainfallThreshold: '',
        temperatureMin: '',
        temperatureMax: '',
      });

      await loadDashboardData();
    } catch (err) {
      console.error('Create policy error:', err);
      alert(err.response?.data?.error || 'Failed to create policy');
    } finally {
      setCreatingPolicy(false);
    }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '4rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem' }}>⏳ Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ paddingTop: '4rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <div
          style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '1.5rem',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          🚀 You don't have permission to access the admin dashboard.
        </div>
      </div>
    );
  }

  const heroStyle = {
    background: 'linear-gradient(135deg, #1B5E20 0%, #2d7a2d 100%)',
    color: '#ffffff',
    paddingTop: '100px',
    paddingBottom: '100px',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    textAlign: 'center',
  };

  const pageHeading = {
    fontSize: 'clamp(2.5rem, 8vw, 3.2rem)',
    fontWeight: 800,
    marginBottom: '1rem',
    letterSpacing: '-0.5px',
  };

  const sectionStyle = {
    paddingTop: '4rem',
    paddingBottom: '4rem',
    paddingLeft: '2rem',
    paddingRight: '2rem',
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const baseCardStyle = {
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f0f0f0',
  };

  const statGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s ease',
  };

  const safeTotalPayouts =
    dashStats && typeof dashStats.totalPayouts === 'number'
      ? (dashStats.totalPayouts / 10 ** 18).toFixed(2)
      : '0.00';

  return (
    <div>
      <section style={heroStyle}>
        <h1 style={{ ...pageHeading, color: '#ffffff' }}>📊 Admin Dashboard</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.95 }}>
          Manage policies, view analytics, and monitor the platform
        </p>
      </section>

      <section style={sectionStyle}>
        <div style={containerStyle}>
          {error && (
            <div
              style={{
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '2rem',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Stats Cards */}
          <div style={statGridStyle}>
            {[
              { emoji: '📋', label: 'Total Policies', value: dashStats?.totalPoliciesAvailable || 0 },
              { emoji: '🛒', label: 'Policies Sold', value: dashStats?.totalPoliciesSold || 0 },
              { emoji: '👥', label: 'Total Users', value: dashStats?.totalUsers || 0 },
              { emoji: '🌾', label: 'Farmers', value: dashStats?.farmerCount || 0 },
              { emoji: '⚙️', label: 'Admins', value: dashStats?.adminCount || 0 },
              { emoji: '💰', label: 'Total Payouts', value: `${safeTotalPayouts} ETH` },
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{
                  ...baseCardStyle,
                  transition: 'all 0.4s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{stat.emoji}</div>
                <h4
                  style={{
                    fontSize: '0.95rem',
                    color: '#6b7280',
                    fontWeight: 500,
                    marginBottom: '0.75rem',
                  }}
                >
                  {stat.label}
                </h4>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1B5E20' }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Create Policy Section */}
          <div style={baseCardStyle} className="create-form-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#1B5E20',
                  margin: 0,
                }}
              >
                ➕ Create New Policy
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateForm(!showCreateForm)}
                style={{
                  padding: '0.875rem 1.5rem',
                  backgroundColor: '#1B5E20',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0d3a0d';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1B5E20';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {showCreateForm ? '✕ Cancel' : '✓ Create Policy'}
              </button>
            </div>

            {showCreateForm && (
              <form
                onSubmit={handleCreatePolicy}
                style={{
                  marginTop: '1.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid #e5e7eb',
                }}
              >
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: '#1f2937',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Policy Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newPolicy.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Rainfall Insurance Premium"
                    required
                    style={inputStyle}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#1B5E20';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(27, 94, 32, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem',
                  }}
                >
                  {[
                    { label: 'Premium (ETH)', name: 'premium', placeholder: '0.5', step: '0.01' },
                    { label: 'Payout (ETH)', name: 'payout', placeholder: '5.0', step: '0.01' },
                    {
                      label: 'Rainfall Threshold (mm)',
                      name: 'rainfallThreshold',
                      placeholder: '100',
                    },
                    { label: 'Min Temperature (°C)', name: 'temperatureMin', placeholder: '-10' },
                    { label: 'Max Temperature (°C)', name: 'temperatureMax', placeholder: '40' },
                  ].map((field) => (
                    <div key={field.name}>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          color: '#1f2937',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {field.label}
                      </label>
                      <input
                        type="number"
                        name={field.name}
                        value={newPolicy[field.name]}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        step={field.step || '1'}
                        required
                        style={inputStyle}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#1B5E20';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(27, 94, 32, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={creatingPolicy}
                  style={{
                    padding: '0.875rem 2rem',
                    backgroundColor: creatingPolicy ? '#d1d5db' : '#FFA500',
                    color: '#1B5E20',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: creatingPolicy ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {creatingPolicy ? '⏳ Creating...' : '✓ Create Policy'}
                </button>
              </form>
            )}
          </div>

          {/* All Policies */}
          <div style={{ ...baseCardStyle, marginTop: '3rem' }}>
            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#1B5E20',
                marginBottom: '1.5rem',
              }}
            >
              All Policies ({policies.length})
            </h3>
            {policies.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '2rem',
                }}
              >
                {policies.map((policy) => {
                  const premiumEth = Number(policy.premium) / 10 ** 18;
                  const payoutEth = Number(policy.payout) / 10 ** 18;

                  return (
                    <div
                      key={policy.id}
                      style={{
                        backgroundColor: '#f9fafb',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow =
                          '0 8px 16px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: '#1B5E20',
                          marginBottom: '1rem',
                        }}
                      >
                        {policy.name}
                      </h4>
                      <div
                        style={{
                          display: 'grid',
                          gap: '0.75rem',
                          fontSize: '0.95rem',
                          color: '#6b7280',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Premium:</span>
                          <span
                            style={{ fontWeight: 600, color: '#1f2937' }}
                          >
                            {Number.isFinite(premiumEth)
                              ? premiumEth.toFixed(2)
                              : '0.00'}{' '}
                            ETH
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Payout:</span>
                          <span
                            style={{ fontWeight: 600, color: '#1f2937' }}
                          >
                            {Number.isFinite(payoutEth)
                              ? payoutEth.toFixed(2)
                              : '0.00'}{' '}
                            ETH
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Rain Threshold:</span>
                          <span
                            style={{ fontWeight: 600, color: '#1f2937' }}
                          >
                            {policy.rainfall_threshold} mm
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Temp Range:</span>
                          <span
                            style={{ fontWeight: 600, color: '#1f2937' }}
                          >
                            {policy.temperature_min}°C to {policy.temperature_max}°C
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingTop: '0.75rem',
                            borderTop: '1px solid #d1d5db',
                          }}
                        >
                          <span>Status:</span>
                          <span
                            style={{
                              backgroundColor: policy.active
                                ? '#dcfce7'
                                : '#fee2e2',
                              color: policy.active ? '#166534' : '#991b1b',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                            }}
                          >
                            {policy.active ? '🟢 Active' : '🔴 Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p
                style={{
                  color: '#6b7280',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  padding: '2rem',
                }}
              >
                📭 No policies created yet.
              </p>
            )}
          </div>

          {/* Users List */}
          <div style={{ ...baseCardStyle, marginTop: '3rem' }}>
            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#1B5E20',
                marginBottom: '1.5rem',
              }}
            >
              Users List ({allUsers.length})
            </h3>
            {allUsers.length > 0 ? (
              <div
                style={{
                  overflowX: 'auto',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: '#f3f4f6',
                        borderBottom: '2px solid #1B5E20',
                      }}
                    >
                      <th
                        style={{
                          padding: '1rem',
                          textAlign: 'left',
                          fontWeight: 700,
                          color: '#1B5E20',
                        }}
                      >
                        ID
                      </th>
                      <th
                        style={{
                          padding: '1rem',
                          textAlign: 'left',
                          fontWeight: 700,
                          color: '#1B5E20',
                        }}
                      >
                        Email
                      </th>
                      <th
                        style={{
                          padding: '1rem',
                          textAlign: 'left',
                          fontWeight: 700,
                          color: '#1B5E20',
                        }}
                      >
                        Role
                      </th>
                      <th
                        style={{
                          padding: '1rem',
                          textAlign: 'left',
                          fontWeight: 700,
                          color: '#1B5E20',
                        }}
                      >
                        Wallet
                      </th>
                      <th
                        style={{
                          padding: '1rem',
                          textAlign: 'left',
                          fontWeight: 700,
                          color: '#1B5E20',
                        }}
                      >
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user, idx) => (
                      <tr
                        key={user.id}
                        style={{
                          backgroundColor:
                            idx % 2 === 0 ? '#ffffff' : '#fafafa',
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        <td style={{ padding: '1rem', color: '#6b7280' }}>
                          {user.id}
                        </td>
                        <td style={{ padding: '1rem', color: '#6b7280' }}>
                          {user.email || '-'}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span
                            style={{
                              backgroundColor:
                                user.role === 'admin' ? '#dcfce7' : '#dbeafe',
                              color:
                                user.role === 'admin'
                                  ? '#166534'
                                  : '#1e40af',
                              padding: '0.4rem 0.8rem',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                            }}
                          >
                            {user.role === 'admin' ? '⚙️ Admin' : '🌾 Farmer'}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: '1rem',
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            wordBreak: 'break-all',
                          }}
                        >
                          {user.wallet_address
                            ? `${user.wallet_address.substring(0, 15)}...`
                            : '-'}
                        </td>
                        <td style={{ padding: '1rem', color: '#6b7280' }}>
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString()
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p
                style={{
                  color: '#6b7280',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  padding: '2rem',
                }}
              >
                📭 No users found
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;