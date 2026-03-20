/**
 * Blockchain Dashboard Component
 * Displays blockchain statistics, contract balance, and payout events
 */

import React, { useState, useEffect } from 'react';
import web3 from '../services/web3';

const BlockchainDashboard = () => {
  const [stats, setStats] = useState(null);
  const [contractBalance, setContractBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payoutEvents, setPayoutEvents] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [userPolicy, setUserPolicy] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  // Initialize and fetch data
  useEffect(() => {
    initializeAndFetch();

    // Set up auto-refresh interval
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchBlockchainData();
      }, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const initializeAndFetch = async () => {
    try {
      setError('');
      setLoading(true);

      // Initialize Web3
      await web3.initializeWeb3();

      // Fetch all data
      await fetchBlockchainData();

      // Set up event listener
      setupEventListener();

    } catch (err) {
      setError(err.message);
      console.error('Error initializing blockchain dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockchainData = async () => {
    try {
      // Fetch contract stats
      const statsData = await web3.getContractStats();
      setStats(statsData);

      // Fetch contract balance
      const balanceData = await web3.getContractBalance();
      setContractBalance(balanceData);

      // Try to get user address and policy
      try {
        const address = web3.getConnectedAddress();
        if (address) {
          setUserAddress(address);
          const policy = await web3.getMyPolicy();
          setUserPolicy(policy);
        }
      } catch (err) {
        // User not connected, that's okay
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching blockchain data:', err);
      throw err;
    }
  };

  const setupEventListener = () => {
    try {
      web3.listenForPayouts((event) => {
        console.log('Payout event received:', event);
        setPayoutEvents(prev => [event, ...prev].slice(0, 10)); // Keep last 10 events
      });
    } catch (err) {
      console.log('Event listener setup skipped (Web3 not fully initialized)');
    }
  };

  const handleManualRefresh = async () => {
    try {
      setLoading(true);
      await fetchBlockchainData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingSpinner}>
          <p>Loading blockchain data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2>⛓️ Blockchain Dashboard</h2>
        <div style={styles.headerActions}>
          <button 
            onClick={handleManualRefresh}
            style={styles.refreshBtn}
            disabled={loading}
          >
            {loading ? '⏳ Refreshing...' : '🔄 Refresh'}
          </button>
          <label style={styles.autoRefreshLabel}>
            <input 
              type="checkbox" 
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh (30s)
          </label>
        </div>
        {lastUpdated && (
          <p style={styles.lastUpdated}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div style={{...styles.alert, ...styles.alertError}}>
          ⚠️ {error}
        </div>
      )}

      {/* Contract Statistics */}
      {stats && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📋</div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Total Policies Sold</div>
              <div style={styles.statValue}>{stats.totalPoliciesSold}</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>💸</div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Total Payouts</div>
              <div style={styles.statValue}>{stats.totalPayoutsTriggered}</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>💰</div>
            <div style={styles.statContent}>
              <div style={styles.statLabel}>Contract Balance</div>
              <div style={styles.statValue}>{contractBalance?.balanceEther} MATIC</div>
            </div>
          </div>
        </div>
      )}

      {/* User Policy Section */}
      {userPolicy && (
        <div style={styles.policyCard}>
          <h3>📋 Your Policy</h3>
          <div style={styles.policyContent}>
            <div style={styles.policyRow}>
              <span style={styles.policyLabel}>Address:</span>
              <code style={styles.code}>
                {userAddress?.substring(0, 6)}...{userAddress?.substring(38)}
              </code>
            </div>
            <div style={styles.policyRow}>
              <span style={styles.policyLabel}>Premium:</span>
              <strong>{web3.formatWeiToMatic(userPolicy.premium)} MATIC</strong>
            </div>
            <div style={styles.policyRow}>
              <span style={styles.policyLabel}>Maximum Payout:</span>
              <strong style={{color: '#10b981'}}>
                {web3.formatWeiToMatic(userPolicy.payout)} MATIC
              </strong>
            </div>
            <div style={styles.policyRow}>
              <span style={styles.policyLabel}>Rainfall Threshold:</span>
              <strong>{userPolicy.rainfallThreshold} mm</strong>
            </div>
            <div style={styles.policyRow}>
              <span style={styles.policyLabel}>Status:</span>
              <strong style={{
                color: userPolicy.active ? '#10b981' : '#ef4444'
              }}>
                {userPolicy.active ? '🟢 Active' : '🔴 Inactive'}
              </strong>
            </div>
            <div style={styles.policyRow}>
              <span style={styles.policyLabel}>Payout Claimed:</span>
              <strong>{userPolicy.payoutClaimed ? '✅ Yes' : '❌ No'}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Payout Events Section */}
      <div style={styles.eventsCard}>
        <h3>🎉 Recent Payout Events</h3>
        {payoutEvents.length > 0 ? (
          <div style={styles.eventsList}>
            {payoutEvents.map((event, index) => (
              <div key={index} style={styles.eventItem}>
                <div style={styles.eventHeader}>
                  <span style={styles.eventFarmer}>
                    {event.farmer?.substring(0, 6)}...{event.farmer?.substring(38)}
                  </span>
                  <span style={styles.eventPayout}>
                    {event.payoutAmount} MATIC
                  </span>
                </div>
                <div style={styles.eventDetails}>
                  <small>
                    Rainfall: {event.rainfall} mm | Threshold: {event.threshold} mm
                  </small>
                </div>
                <div style={styles.eventFooter}>
                  <a 
                    href={`https://amoy.polygonscan.com/tx/${event.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.eventLink}
                  >
                    View on Polygonscan →
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p>No payout events yet. Check back later!</p>
          </div>
        )}
      </div>

      {/* Contract Info */}
      <div style={styles.infoCard}>
        <h3>ℹ️ Contract Information</h3>
        <div style={styles.infoContent}>
          <div style={styles.infoItem}>
            <strong>Network:</strong> Polygon Amoy
          </div>
          <div style={styles.infoItem}>
            <strong>Contract Address:</strong>
            <code style={styles.code}>
              {process.env.VITE_CONTRACT_ADDRESS || 'Not configured'}
            </code>
          </div>
          <div style={styles.infoItem}>
            <strong>View on Polygonscan:</strong>
            <a 
              href={web3.getContractPolygonscanUrl()}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              Open Contract →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '2rem',
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  headerActions: {
    marginTop: '1rem',
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  refreshBtn: {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: 'none',
    background: '#3b82f6',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
  },
  autoRefreshLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
  },
  lastUpdated: {
    marginTop: '0.5rem',
    color: '#6b7280',
    fontSize: '0.875rem',
  },
  alert: {
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    border: '1px solid',
  },
  alertError: {
    background: '#fee2e2',
    borderColor: '#fecaca',
    color: '#991b1b',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  statIcon: {
    fontSize: '2rem',
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    color: '#6b7280',
    fontSize: '0.875rem',
    marginBottom: '0.25rem',
  },
  statValue: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  policyCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem',
    border: '2px solid #bfdbfe',
  },
  policyContent: {
    marginTop: '1rem',
  },
  policyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid #e5e7eb',
  },
  policyLabel: {
    color: '#6b7280',
    fontWeight: '600',
  },
  eventsCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem',
    border: '2px solid #dcfce7',
  },
  eventsList: {
    marginTop: '1rem',
  },
  eventItem: {
    padding: '1rem',
    background: '#f9fafb',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    marginBottom: '0.75rem',
  },
  eventHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  eventFarmer: {
    background: '#e0e7ff',
    padding: '0.25rem 0.75rem',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '0.875rem',
  },
  eventPayout: {
    fontWeight: 'bold',
    color: '#10b981',
    fontSize: '1.1rem',
  },
  eventDetails: {
    color: '#6b7280',
    marginBottom: '0.5rem',
  },
  eventFooter: {
    marginTop: '0.75rem',
  },
  eventLink: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.875rem',
  },
  emptyState: {
    padding: '2rem',
    textAlign: 'center',
    color: '#6b7280',
  },
  infoCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '2px solid #fcd34d',
  },
  infoContent: {
    marginTop: '1rem',
  },
  infoItem: {
    padding: '0.75rem 0',
    borderBottom: '1px solid #e5e7eb',
  },
  code: {
    background: '#f3f4f6',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    marginLeft: '0.5rem',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
    marginLeft: '0.5rem',
    fontWeight: '600',
  },
  loadingSpinner: {
    background: 'white',
    padding: '3rem',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#6b7280',
  },
};

export default BlockchainDashboard;
