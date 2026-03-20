import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI, adminAPI } from '../services/api';

const Profile = () => {
  const { user, isAdmin, isFarmer } = useAuth();
  const [profile, setProfile] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [dashStats, setDashStats] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    } else if (isFarmer) {
      loadFarmerData();
    }
  }, [isAdmin, isFarmer]);

  const loadFarmerData = async () => {
    try {
      setLoading(true);
      const profileRes = await userAPI.getProfile();
      const purchasesRes = await userAPI.getPurchases();
      const transactionsRes = await userAPI.getTransactions();

      setProfile(profileRes.data);
      setPurchases(purchasesRes.data || []);
      setTransactions(transactionsRes.data || []);
    } catch (err) {
      setError('Failed to load profile data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const statsRes = await adminAPI.getDashboardStats();
      const usersRes = await adminAPI.getAllUsers(100, 0);

      setDashStats(statsRes.data);
      setAllUsers(usersRes.data || []);
    } catch (err) {
      setError('Failed to load admin dashboard');
      console.error(err);
    } finally {
      setLoading(false);
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
          <h1>👤 {isAdmin ? 'Admin Dashboard' : 'My Profile'}</h1>
          <p>{user?.email}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {error && <div className="alert alert-error">{error}</div>}

          {isAdmin ? (
            // Admin Dashboard View
            <>
              <div className="grid-3">
                <div className="card">
                  <h4>📊 Total Policies Available</h4>
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

              {/* Users Table */}
              <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Users List</h3>
                {allUsers.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Wallet Address</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map(u => (
                          <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.email || '-'}</td>
                            <td><span className="policy-badge">{u.role}</span></td>
                            <td style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>
                              {u.wallet_address || '-'}
                            </td>
                            <td>{new Date(u.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No users found</p>
                )}
              </div>
            </>
          ) : (
            // Farmer Profile View
            <>
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Profile Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Email</p>
                    <p style={{ fontWeight: 'bold' }}>{profile?.email}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Role</p>
                    <p style={{ fontWeight: 'bold' }}>{profile?.role}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Wallet Address</p>
                    <p style={{ fontWeight: 'bold', fontSize: '0.8rem', wordBreak: 'break-all' }}>
                      {profile?.wallet_address || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Member Since</p>
                    <p style={{ fontWeight: 'bold' }}>
                      {new Date(profile?.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Purchases */}
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>My Purchased Policies ({purchases.length})</h3>
                {purchases.length > 0 ? (
                  <div className="grid-2">
                    {purchases.map(p => (
                      <div key={p.id} className="card" style={{ marginTop: '0' }}>
                        <h4>{p.name}</h4>
                        <div style={{ marginTop: '1rem' }}>
                          <p><strong>Status:</strong> <span className="policy-badge">{p.status}</span></p>
                          <p><strong>Premium:</strong> {(p.premium / 10 ** 18).toFixed(2)} ETH</p>
                          <p><strong>Payout:</strong> {(p.payout / 10 ** 18).toFixed(2)} ETH</p>
                          <p><strong>Purchased:</strong> {new Date(p.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ marginTop: '1rem' }}>No policies purchased yet. <a href="/policies">Browse policies</a></p>
                )}
              </div>

              {/* Transactions */}
              <div className="card">
                <h3>Transaction History ({transactions.length})</h3>
                {transactions.length > 0 ? (
                  <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>TX Hash</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map(t => (
                          <tr key={t.id}>
                            <td>{t.tx_type}</td>
                            <td>{(t.amount / 10 ** 18).toFixed(2)} ETH</td>
                            <td><span className="policy-badge">{t.status}</span></td>
                            <td>{new Date(t.created_at).toLocaleDateString()}</td>
                            <td style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>
                              {t.tx_hash.substring(0, 10)}...
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ marginTop: '1rem' }}>No transactions yet</p>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;
