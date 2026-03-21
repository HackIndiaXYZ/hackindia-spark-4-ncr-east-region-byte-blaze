import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const formatINR = (amt) => `₹${Number(amt).toLocaleString('en-IN')}`;

const Profile = () => {
  const { user, isFarmer } = useAuth();
  const [profile, setProfile] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFarmer) loadFarmerData();
    else setLoading(false);
  }, [isFarmer]);

  const loadFarmerData = async () => {
    try {
      const [profileRes, purchasesRes, transactionsRes] = await Promise.all([
        userAPI.getProfile(), userAPI.getPurchases(), userAPI.getTransactions()
      ]);
      setProfile(profileRes.data);
      setPurchases(purchasesRes.data || []);
      setTransactions(transactionsRes.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div style={{ padding: '80px', textAlign: 'center', fontSize: '1.5rem' }}>⏳ Loading Profile...</div>;
  if (!isFarmer) return <div style={{ padding: '80px', textAlign: 'center' }}>Admin profiles are managed via the dashboard.</div>;

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Hero */}
      <div style={{ padding: '80px 24px', background: 'var(--gradient-dark)', color: 'white', textAlign: 'center' }}>
        <h1 className="animate-fade-in-up" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'white', margin: 0 }}>👤 My <span className="text-gradient-accent">Profile</span></h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginTop: '10px' }}>{user?.email}</p>
      </div>

      <div className="page-container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        
        {/* Profile Info */}
        <div className="glass-panel" style={{ padding: '32px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>ℹ️ Account Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {[
              { label: 'ROLE', value: <span className="badge">{profile?.role?.toUpperCase()}</span> },
              { label: 'WALLET', value: profile?.wallet_address || 'Not Linked' },
              { label: 'JOINED', value: new Date(profile?.created_at).toLocaleDateString() },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(0,0,0,0.03)', padding: '20px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '8px', wordBreak: 'break-all' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Purchased Policies */}
        <div className="glass-panel" style={{ padding: '32px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>🛡️ My Policies ({purchases.length})</h3>
          {purchases.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px' }}>You haven't purchased any policies yet. <a href="/policies" style={{ color: 'var(--color-primary)' }}>Browse policies →</a></p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {purchases.map(p => (
                <div key={p.id} style={{ border: '1px solid var(--color-border)', borderRadius: '16px', padding: '24px', background: 'var(--color-surface)' }}>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--color-primary-dark)' }}>{p.name}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Status:</span>
                    <span className="badge">{(p.status || 'active').toUpperCase()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Premium Paid:</span>
                    <span style={{ fontWeight: 700 }}>{formatINR(p.premium)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Coverage:</span>
                    <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{formatINR(p.payout)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transactions */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>💸 Transactions ({transactions.length})</h3>
          {transactions.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px' }}>No transactions yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                    <th style={{ padding: '16px', color: 'var(--color-primary)' }}>Type</th>
                    <th style={{ padding: '16px', color: 'var(--color-primary)' }}>Amount</th>
                    <th style={{ padding: '16px', color: 'var(--color-primary)' }}>Status</th>
                    <th style={{ padding: '16px', color: 'var(--color-primary)' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)', background: i%2===0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                      <td style={{ padding: '16px', fontWeight: 600 }}>{t.tx_type?.replace('_', ' ').toUpperCase()}</td>
                      <td style={{ padding: '16px', fontWeight: 700, color: 'var(--color-primary)' }}>{formatINR(t.amount)}</td>
                      <td style={{ padding: '16px' }}><span className="badge">{t.status}</span></td>
                      <td style={{ padding: '16px' }}>{new Date(t.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
