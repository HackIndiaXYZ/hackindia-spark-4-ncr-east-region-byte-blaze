import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { userAPI, adminAPI } from '../services/api';
import { colors, spacing, shadows, borderRadius, transitions, commonStyles } from '../styles/constants';

const Profile = () => {
  const { user, isAdmin, isFarmer } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [dashStats, setDashStats] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

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

  // Component styles using constants
  const heroStyle = {
    ...commonStyles.heroGradient,
  };

  const containerStyle = {
    ...commonStyles.container,
    paddingTop: spacing.lg,
    paddingBottom: spacing.full,
  };

  const statCardStyle = {
    ...commonStyles.card,
    textAlign: 'center',
  };

  const cardStyle = {
    ...commonStyles.card,
    marginBottom: spacing.lg,
  };

  const cardHeaderStyle = {
    padding: spacing.lg,
    borderBottom: `1px solid ${colors.borderLight}`,
    backgroundColor: colors.bg.light,
  };

  const cardBodyStyle = {
    padding: spacing.lg,
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const theadCellStyle = {
    padding: spacing.base,
    textAlign: 'left',
    fontWeight: 700,
    color: colors.primary,
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: `2px solid ${colors.primary}`,
  };

  const tbodyCellStyle = {
    padding: spacing.base,
    borderBottom: `1px solid ${colors.border}`,
    color: colors.text.primary,
  };

  const statGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  };

  const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: spacing.lg,
  };

  const infoItemStyle = {
    backgroundColor: colors.bg.light,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.border}`,
  };

  const badgeStyle = (type = 'info') => {
    const badgeMap = {
      active: { bg: '#dcfce7', color: '#166534' },
      inactive: { bg: '#fee2e2', color: '#991b1b' },
      admin: { bg: '#fef3c7', color: '#92400e' },
      farmer: { bg: '#dbeafe', color: '#1e40af' },
      confirmed: { bg: '#dcfce7', color: '#166534' },
      pending: { bg: '#fee2e2', color: '#991b1b' },
    };
    const style = badgeMap[type] || badgeMap.info;
    return {
      display: 'inline-block',
      backgroundColor: style.bg,
      color: style.color,
      padding: `0.4rem ${spacing.base}`,
      borderRadius: borderRadius.sm,
      fontSize: '0.75rem',
      fontWeight: 700,
    };
  };

  const loadingContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    fontSize: '1.2rem',
    color: colors.primary,
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: spacing.full,
    backgroundColor: colors.bg.lighter,
    borderRadius: borderRadius.md,
    border: `2px dashed ${colors.border}`,
  };

  const renderProfileInfoGrid = () => (
    <div style={infoGridStyle}>
      {[
        { label: '✉️ Email', value: profile?.email, icon: '✉️' },
        { label: '👤 Role', value: profile?.role?.toUpperCase(), icon: '👤' },
        { label: '🔗 Wallet', value: profile?.wallet_address || 'Not set', icon: '🔗' },
        { label: '📅 Member Since', value: new Date(profile?.created_at).toLocaleDateString(), icon: '📅' },
      ].map((item, idx) => (
        <div
          key={idx}
          style={infoItemStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = shadows.md;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = shadows.base;
          }}
        >
          <div style={{ fontSize: '0.9rem', color: colors.primary, fontWeight: 700, marginBottom: spacing.sm }}>
            {item.label}
          </div>
          <div
            style={{
              fontSize: '0.95rem',
              color: colors.text.primary,
              fontWeight: 500,
              wordBreak: 'break-all',
              fontFamily: item.label.includes('Wallet') ? 'monospace' : 'inherit',
            }}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );

  const renderPurchaseCard = (purchase) => (
    <div
      key={purchase.id}
      style={{
        backgroundColor: colors.bg.white,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        transition: transitions.base,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = shadows.md;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = shadows.base;
      }}
    >
      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: colors.primary, marginBottom: spacing.base }}>
        {purchase.name}
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, fontSize: '0.95rem' }}>
        <div>
          <span style={{ color: colors.text.secondary, fontWeight: 600 }}>Status: </span>
          <span style={badgeStyle(purchase.status)}>{purchase.status}</span>
        </div>
        <div>
          <span style={{ color: colors.text.secondary, fontWeight: 600 }}>Premium: </span>
          <span style={{ color: colors.primary, fontWeight: 700 }}>
            {(purchase.premium / 10 ** 18).toFixed(2)} ETH
          </span>
        </div>
        <div>
          <span style={{ color: colors.text.secondary, fontWeight: 600 }}>Payout: </span>
          <span style={{ color: colors.success, fontWeight: 700 }}>
            {(purchase.payout / 10 ** 18).toFixed(2)} ETH
          </span>
        </div>
        <div>
          <span style={{ color: colors.text.secondary, fontWeight: 600 }}>Purchased: </span>
          {new Date(purchase.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );

  const renderStatCard = (stat, index) => (
    <div
      key={index}
      style={{
        ...statCardStyle,
        ...(hoveredCard === `stat-${index}` ? commonStyles.cardHover : {}),
        transition: transitions.base,
      }}
      onMouseEnter={() => setHoveredCard(`stat-${index}`)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div style={{ fontSize: '2rem', marginBottom: spacing.base }}>
        {stat.emoji}
      </div>
      <div style={{ fontSize: '0.9rem', color: colors.text.secondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: spacing.sm }}>
        {stat.label}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.color }}>
        {stat.value}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ backgroundColor: colors.bg.light }}>
        <section style={heroStyle}>
          <h1 style={{ color: colors.bg.white, fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 800, marginBottom: 0 }}>
            {isAdmin ? '👨‍💼 Admin Dashboard' : '👤 My Profile'}
          </h1>
        </section>
        <div style={containerStyle}>
          <div style={loadingContainerStyle}>⏳ {t.common.loading}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.bg.light, minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={heroStyle}>
        <h1 style={{ color: colors.bg.white, fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 800, marginBottom: spacing.base }}>
          {isAdmin ? '👨‍💼 Admin Dashboard' : '👤 My Profile'}
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem', marginBottom: 0 }}>
          {user?.email}
        </p>
      </section>

      {/* Content Section */}
      <section style={{ ...containerStyle, backgroundColor: colors.bg.light, paddingTop: spacing.lg, paddingBottom: spacing.full }}>
        {error && (
          <div style={{ ...commonStyles.alert('error'), marginBottom: spacing.lg }}>
            ❌ {error}
          </div>
        )}

        {isAdmin ? (
          <>
            {/* Admin Dashboard Stats */}
            <div style={statGridStyle}>
              {[
                { emoji: '📊', label: 'Total Policies', value: dashStats?.totalPoliciesAvailable || 0, color: colors.primary },
                { emoji: '🛒', label: 'Sold', value: dashStats?.totalPoliciesSold || 0, color: colors.primary },
                { emoji: '👥', label: 'Total Users', value: dashStats?.totalUsers || 0, color: colors.primary },
                { emoji: '🌾', label: 'Farmers', value: dashStats?.farmerCount || 0, color: colors.primaryLight },
                { emoji: '⚙️', label: 'Admins', value: dashStats?.adminCount || 0, color: colors.primaryLight },
                { emoji: '💰', label: 'Total Payouts', value: `${(dashStats?.totalPayouts / 10 ** 18 || 0).toFixed(2)} ETH`, color: colors.accent },
              ].map((stat, idx) => renderStatCard(stat, idx))}
            </div>

            {/* Users Table */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.primary, margin: 0 }}>
                  👥 Users List
                </h3>
              </div>
              <div style={cardBodyStyle}>
                {allUsers.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                      <thead style={{ backgroundColor: colors.bg.lighter, borderBottom: `2px solid ${colors.primary}` }}>
                        <tr>
                          <th style={theadCellStyle}>ID</th>
                          <th style={theadCellStyle}>Email</th>
                          <th style={theadCellStyle}>Role</th>
                          <th style={theadCellStyle}>Wallet</th>
                          <th style={theadCellStyle}>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map((u, idx) => (
                          <tr
                            key={u.id}
                            style={{
                              backgroundColor: idx % 2 === 0 ? colors.bg.light : colors.bg.white,
                              transition: transitions.base,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = colors.bg.lighter;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = idx % 2 === 0 ? colors.bg.light : colors.bg.white;
                            }}
                          >
                            <td style={tbodyCellStyle}>{u.id}</td>
                            <td style={tbodyCellStyle}>{u.email || '-'}</td>
                            <td style={tbodyCellStyle}>
                              <span style={badgeStyle(u.role)}>
                                {u.role}
                              </span>
                            </td>
                            <td style={{ ...tbodyCellStyle, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                              {u.wallet_address ? u.wallet_address.substring(0, 12) + '...' : '-'}
                            </td>
                            <td style={tbodyCellStyle}>{new Date(u.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={emptyStateStyle}>
                    <div style={{ fontSize: '2rem', marginBottom: spacing.base }}>📭</div>
                    <p style={{ color: colors.text.secondary, marginBottom: 0 }}>No users found</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Farmer Profile Information */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.primary, margin: 0 }}>
                  ℹ️ Profile Information
                </h3>
              </div>
              <div style={cardBodyStyle}>{renderProfileInfoGrid()}</div>
            </div>

            {/* Purchased Policies */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.primary, margin: 0 }}>
                  🛡️ My Policies ({purchases.length})
                </h3>
              </div>
              <div style={cardBodyStyle}>
                {purchases.length > 0 ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: spacing.lg,
                    }}
                  >
                    {purchases.map((p) => renderPurchaseCard(p))}
                  </div>
                ) : (
                  <div style={emptyStateStyle}>
                    <div style={{ fontSize: '2rem', marginBottom: spacing.base }}>📭</div>
                    <p style={{ color: colors.text.secondary, marginBottom: 0 }}>
                      No policies purchased yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Transaction History */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.primary, margin: 0 }}>
                  💸 My Transactions ({transactions.length})
                </h3>
              </div>
              <div style={cardBodyStyle}>
                {transactions.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                      <thead style={{ backgroundColor: colors.bg.lighter, borderBottom: `2px solid ${colors.primary}` }}>
                        <tr>
                          <th style={theadCellStyle}>Type</th>
                          <th style={theadCellStyle}>Amount</th>
                          <th style={theadCellStyle}>Status</th>
                          <th style={theadCellStyle}>Date</th>
                          <th style={theadCellStyle}>TX Hash</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((txn, idx) => (
                          <tr
                            key={txn.id}
                            style={{
                              backgroundColor: idx % 2 === 0 ? colors.bg.light : colors.bg.white,
                              transition: transitions.base,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = colors.bg.lighter;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = idx % 2 === 0 ? colors.bg.light : colors.bg.white;
                            }}
                          >
                            <td style={tbodyCellStyle}>{txn.tx_type}</td>
                            <td style={tbodyCellStyle}>
                              <span style={{ fontWeight: 700, color: colors.primary }}>
                                {(txn.amount / 10 ** 18).toFixed(2)} ETH
                              </span>
                            </td>
                            <td style={tbodyCellStyle}>
                              <span style={badgeStyle(txn.status)}>
                                {txn.status}
                              </span>
                            </td>
                            <td style={tbodyCellStyle}>{new Date(txn.created_at).toLocaleDateString()}</td>
                            <td style={{ ...tbodyCellStyle, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                              {txn.tx_hash.substring(0, 10)}...
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={emptyStateStyle}>
                    <div style={{ fontSize: '2rem', marginBottom: spacing.base }}>📭</div>
                    <p style={{ color: colors.text.secondary, marginBottom: 0 }}>
                      No transactions yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Profile;
