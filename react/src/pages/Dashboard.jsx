import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI, policyAPI } from '../services/api';

const formatINR = (v) => `₹${Number(v).toLocaleString('en-IN')}`;

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Create/Edit form state
  const [showForm, setShowForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [form, setForm] = useState({ name: '', premium: '', payout: '', rainfallThreshold: 100, temperatureMin: -10, temperatureMax: 50 });

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsRes, polRes, purchRes, usrRes] = await Promise.all([
        adminAPI.getDashboardStats(), policyAPI.getAll(), adminAPI.getAllPurchases(), adminAPI.getAllUsers()
      ]);
      setStats(statsRes.data);
      setPolicies(polRes.data || []);
      setPurchases(purchRes.data || []);
      setUsers(usrRes.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      if (editingPolicy) {
        await adminAPI.updatePolicy(editingPolicy.id, form);
        setMsg('✅ Policy updated!');
      } else {
        await adminAPI.createPolicy(form);
        setMsg('✅ Policy created!');
      }
      setShowForm(false); setEditingPolicy(null);
      setForm({ name: '', premium: '', payout: '', rainfallThreshold: 100, temperatureMin: -10, temperatureMax: 50 });
      await loadAll();
    } catch (e) {
      setMsg('❌ ' + (e.response?.data?.error || 'Operation failed'));
    }
  };

  const handleEdit = (p) => {
    setEditingPolicy(p);
    setForm({ name: p.name, premium: p.premium, payout: p.payout, rainfallThreshold: p.rainfall_threshold, temperatureMin: p.temperature_min, temperatureMax: p.temperature_max });
    setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete policy "${name}"?`)) return;
    try {
      await adminAPI.deletePolicy(id);
      setMsg('✅ Policy deleted');
      await loadAll();
    } catch (e) { setMsg('❌ Delete failed'); }
  };

  if (!isAdmin) return <div style={{ padding: 80, textAlign: 'center' }}>🚫 Admin access required</div>;
  if (loading) return <div style={{ padding: 80, textAlign: 'center', fontSize: '1.5rem' }}>⏳ Loading Dashboard...</div>;

  const tabBtn = (t, label) => (
    <button onClick={() => setTab(t)} style={{
      padding: '10px 24px', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
      background: tab === t ? 'var(--gradient-primary)' : 'transparent', color: tab === t ? 'white' : 'var(--color-text-muted)',
      fontWeight: 600, fontFamily: 'Outfit', fontSize: '0.95rem', transition: 'all 0.2s'
    }}>{label}</button>
  );

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{ padding: '80px 24px', background: 'var(--gradient-dark)', color: 'white', textAlign: 'center' }}>
        <h1 className="animate-fade-in-up" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'white' }}>
          ⚙️ Admin <span className="text-gradient-accent">Dashboard</span>
        </h1>
      </div>

      <div className="page-container" style={{ marginTop: '-30px', position: 'relative', zIndex: 10 }}>
        {msg && <div className="glass-panel" style={{ padding: 16, marginBottom: 24, borderLeft: '4px solid var(--color-primary)', fontWeight: 600 }}>{msg}</div>}

        {/* Tabs */}
        <div className="glass-panel" style={{ display: 'flex', gap: 8, padding: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          {tabBtn('overview', '📊 Overview')}
          {tabBtn('policies', '📋 Policies')}
          {tabBtn('purchases', '🛒 Purchases')}
          {tabBtn('users', '👥 Users')}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { emoji: '📋', label: 'Active Policies', value: stats?.totalPoliciesAvailable || 0 },
              { emoji: '🛒', label: 'Policies Sold', value: stats?.totalPoliciesSold || 0 },
              { emoji: '👥', label: 'Total Users', value: stats?.totalUsers || 0 },
              { emoji: '🌾', label: 'Farmers', value: stats?.farmerCount || 0 },
              { emoji: '💰', label: 'Total Payouts', value: formatINR(stats?.totalPayouts || 0) },
            ].map((s, i) => (
              <div key={i} className="glass-panel animate-fade-in-up" style={{ padding: 24, textAlign: 'center', animationDelay: `${i * 0.08}s` }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{s.emoji}</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)' }}>{s.value}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* POLICIES CRUD */}
        {tab === 'policies' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0 }}>All Policies ({policies.length})</h2>
              <button onClick={() => { setShowForm(!showForm); setEditingPolicy(null); setForm({ name: '', premium: '', payout: '', rainfallThreshold: 100, temperatureMin: -10, temperatureMax: 50 }); }}
                className="btn-premium">{showForm ? '✕ Cancel' : '+ Create Policy'}</button>
            </div>

            {showForm && (
              <form onSubmit={handleCreateOrUpdate} className="glass-panel" style={{ padding: 32, marginBottom: 32 }}>
                <h3 style={{ marginBottom: 20 }}>{editingPolicy ? 'Edit Policy' : 'Create New Policy'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                  {[
                    { label: 'Policy Name', key: 'name', type: 'text', required: true },
                    { label: 'Premium (₹)', key: 'premium', type: 'number', required: true },
                    { label: 'Payout (₹)', key: 'payout', type: 'number', required: true },
                    { label: 'Rainfall Threshold (mm)', key: 'rainfallThreshold', type: 'number' },
                    { label: 'Min Temp (°C)', key: 'temperatureMin', type: 'number' },
                    { label: 'Max Temp (°C)', key: 'temperatureMax', type: 'number' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="premium-label">{f.label}</label>
                      <input type={f.type} value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="premium-input" required={f.required} />
                    </div>
                  ))}
                </div>
                <button type="submit" className="btn-premium" style={{ marginTop: 20 }}>
                  {editingPolicy ? '💾 Update Policy' : '✅ Create Policy'}
                </button>
              </form>
            )}

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                    {['ID', 'Name', 'Premium', 'Payout', 'Rainfall', 'Temp Range', 'Actions'].map(h => (
                      <th key={h} style={{ padding: 16, color: 'var(--color-primary)', fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {policies.map((p, i) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                      <td style={{ padding: 16 }}>{p.id}</td>
                      <td style={{ padding: 16, fontWeight: 600 }}>{p.name}</td>
                      <td style={{ padding: 16 }}>{formatINR(p.premium)}</td>
                      <td style={{ padding: 16, color: 'var(--color-primary)', fontWeight: 700 }}>{formatINR(p.payout)}</td>
                      <td style={{ padding: 16 }}>{p.rainfall_threshold} mm</td>
                      <td style={{ padding: 16 }}>{p.temperature_min}°C — {p.temperature_max}°C</td>
                      <td style={{ padding: 16, display: 'flex', gap: 8 }}>
                        <button onClick={() => handleEdit(p)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--color-primary)', background: 'white', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}>✏️ Edit</button>
                        <button onClick={() => handleDelete(p.id, p.name)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #ef4444', background: 'white', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}>🗑 Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PURCHASES */}
        {tab === 'purchases' && (
          <div>
            <h2 style={{ marginBottom: 24 }}>All Purchases ({purchases.length})</h2>
            <div className="glass-panel" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                    {['User', 'Policy', 'Premium', 'Coverage', 'Status', 'Payout', 'Date'].map(h => (
                      <th key={h} style={{ padding: 16, color: 'var(--color-primary)', fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((p, i) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                      <td style={{ padding: 16 }}>{p.user_email}</td>
                      <td style={{ padding: 16, fontWeight: 600 }}>{p.policy_name}</td>
                      <td style={{ padding: 16 }}>{formatINR(p.premium)}</td>
                      <td style={{ padding: 16, color: 'var(--color-primary)', fontWeight: 700 }}>{formatINR(p.payout)}</td>
                      <td style={{ padding: 16 }}><span className="badge">{(p.status || 'active').toUpperCase()}</span></td>
                      <td style={{ padding: 16 }}>{p.payout_triggered ? formatINR(p.payout_amount) : '—'}</td>
                      <td style={{ padding: 16 }}>{new Date(p.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {purchases.length === 0 && <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted)' }}>No purchases yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div>
            <h2 style={{ marginBottom: 24 }}>All Users ({users.length})</h2>
            <div className="glass-panel" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                    {['ID', 'Email', 'Role', 'Wallet', 'Joined'].map(h => (
                      <th key={h} style={{ padding: 16, color: 'var(--color-primary)', fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                      <td style={{ padding: 16 }}>{u.id}</td>
                      <td style={{ padding: 16, fontWeight: 600 }}>{u.email}</td>
                      <td style={{ padding: 16 }}><span className="badge">{u.role?.toUpperCase()}</span></td>
                      <td style={{ padding: 16, fontSize: '0.85rem', fontFamily: 'monospace' }}>{u.wallet_address || '—'}</td>
                      <td style={{ padding: 16 }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;