/**
 * Blockchain Policy Buyer Component
 * Allows farmers to buy insurance policies using MetaMask
 */

import React, { useState, useEffect } from 'react';
import web3 from '../services/web3';

const BlockchainPolicyBuyer = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [rainfallThreshold, setRainfallThreshold] = useState('50');
  const [premiumAmount, setPremiumAmount] = useState('0.5');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [txHash, setTxHash] = useState('');
  const [userPolicy, setUserPolicy] = useState(null);
  const [loadingPolicy, setLoadingPolicy] = useState(false);

  // Initialize Web3 on component mount
  useEffect(() => {
    initWeb3();
  }, []);

  const initWeb3 = async () => {
    try {
      setError('');
      await web3.initializeWeb3();
      console.log('✅ Web3 initialized');
    } catch (err) {
      setError(err.message);
      console.error('Web3 initialization error:', err);
    }
  };

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      setLoading(true);
      setError('');

      // Connect to MetaMask
      const address = await web3.connectWallet();
      setWalletAddress(address);
      setIsConnected(true);

      // Check network
      try {
        await web3.checkNetwork();
      } catch (networkError) {
        console.log('Switching to Amoy network...');
        await web3.switchToAmoyNetwork();
      }

      // Get balance
      const balanceData = await web3.getWalletBalance();
      setBalance(balanceData.balanceMatic);

      // Fetch user's policy if exists
      fetchUserPolicy();
    } catch (err) {
      setError(err.message);
      console.error('Connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's existing policy
  const fetchUserPolicy = async () => {
    try {
      setLoadingPolicy(true);
      const policy = await web3.getMyPolicy();
      setUserPolicy(policy);
    } catch (err) {
      console.log('No existing policy found');
      setUserPolicy(null);
    } finally {
      setLoadingPolicy(false);
    }
  };

  // Handle policy purchase
  const handleBuyPolicy = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      if (!isConnected) {
        setError('Please connect your wallet first');
        return;
      }

      // Validate inputs
      if (!rainfallThreshold || rainfallThreshold <= 0) {
        setError('Please enter a valid rainfall threshold');
        return;
      }

      if (!premiumAmount || premiumAmount <= 0) {
        setError('Please enter a valid premium amount');
        return;
      }

      // Check balance
      const balanceNum = parseFloat(balance);
      const premiumNum = parseFloat(premiumAmount);
      if (balanceNum < premiumNum) {
        setError(`Insufficient balance. You have ${balance} MATIC but need ${premiumAmount} MATIC`);
        return;
      }

      // Buy policy
      const result = await web3.buyPolicy(rainfallThreshold, premiumAmount);
      
      setTxHash(result.transactionHash);
      setSuccessMessage('✅ Policy purchased successfully!');
      
      // Reset form
      setRainfallThreshold('50');
      setPremiumAmount('0.5');

      // Fetch updated balance
      const newBalance = await web3.getWalletBalance();
      setBalance(newBalance.balanceMatic);

      // Fetch updated policy
      fetchUserPolicy();

    } catch (err) {
      setError(err.message || 'Failed to purchase policy');
      console.error('Purchase error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle disconnect
  const handleDisconnect = () => {
    web3.disconnectWallet();
    setIsConnected(false);
    setWalletAddress(null);
    setBalance(null);
    setUserPolicy(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2>⛓️ Blockchain Insurance Policy</h2>
          <p style={styles.subtitle}>Buy insurance policies directly on the Polygon blockchain</p>
        </div>

        {/* Connection Status */}
        <div style={styles.statusSection}>
          {isConnected ? (
            <div style={styles.connectedStatus}>
              <h3>✅ Wallet Connected</h3>
              <div style={styles.statusDetails}>
                <p><strong>Address:</strong> {walletAddress?.substring(0, 6)}...{walletAddress?.substring(38)}</p>
                <p><strong>Balance:</strong> {balance} MATIC</p>
                <button 
                  onClick={handleDisconnect}
                  style={{...styles.button, ...styles.disconnectBtn}}
                >
                  Disconnect Wallet
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.disconnectedStatus}>
              <h3>❌ Wallet Not Connected</h3>
              <p>Connect your MetaMask wallet to buy policies</p>
              <button 
                onClick={handleConnectWallet}
                disabled={loading}
                style={styles.button}
              >
                {loading ? 'Connecting...' : '🦊 Connect MetaMask'}
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {/* {error && (
          <div style={styles.alert} style={{...styles.alert, ...styles.alertError}}>
            ⚠️ {error}
          </div>
        )} */}

        {/* Success Message */}
        {successMessage && (
          <div style={{...styles.alert, ...styles.alertSuccess}}>
            {successMessage}
            {txHash && (
              <div style={styles.txLink}>
                <a 
                  href={web3.getPolygonscanUrl(txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  📍 View on Polygonscan
                </a>
              </div>
            )}
          </div>
        )}

        {/* Current Policy Display */}
        {isConnected && userPolicy && (
          <div style={styles.policySection}>
            <h3>📋 Your Current Policy</h3>
            <div style={styles.policyDetails}>
              <div style={styles.policyRow}>
                <span>Premium:</span>
                <strong>{web3.formatWeiToMatic(userPolicy.premium)} MATIC</strong>
              </div>
              <div style={styles.policyRow}>
                <span>Payout:</span>
                <strong>{web3.formatWeiToMatic(userPolicy.payout)} MATIC</strong>
              </div>
              <div style={styles.policyRow}>
                <span>Rainfall Threshold:</span>
                <strong>{userPolicy.rainfallThreshold} mm</strong>
              </div>
              <div style={styles.policyRow}>
                <span>Status:</span>
                <strong style={{color: userPolicy.active ? '#10b981' : '#ef4444'}}>
                  {userPolicy.active ? '🟢 Active' : '🔴 Inactive'}
                </strong>
              </div>
              <div style={styles.policyRow}>
                <span>Payout Claimed:</span>
                <strong>{userPolicy.payoutClaimed ? '✅ Yes' : '❌ No'}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Buy Policy Form */}
        {isConnected && (
          <div style={styles.formSection}>
            <h3>🛡️ Buy New Policy</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Rainfall Threshold (mm) *
              </label>
              <input
                type="number"
                value={rainfallThreshold}
                onChange={(e) => setRainfallThreshold(e.target.value)}
                placeholder="e.g., 50"
                style={styles.input}
                disabled={loading}
                min="1"
                max="500"
              />
              <small style={styles.help}>
                Payout triggers when rainfall exceeds this threshold
              </small>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Premium Amount (MATIC) *
              </label>
              <input
                type="number"
                value={premiumAmount}
                onChange={(e) => setPremiumAmount(e.target.value)}
                placeholder="e.g., 0.5"
                style={styles.input}
                disabled={loading}
                step="0.1"
                min="0.1"
              />
              <small style={styles.help}>
                Maximum payout will be 2x the premium
              </small>
            </div>

            <div style={styles.payoutCalculation}>
              <div style={styles.payoutRow}>
                <span>Premium:</span>
                <strong>{premiumAmount} MATIC</strong>
              </div>
              <div style={styles.payoutRow}>
                <span>Maximum Payout:</span>
                <strong style={{color: '#10b981'}}>
                  {(parseFloat(premiumAmount) * 2).toFixed(2)} MATIC
                </strong>
              </div>
            </div>

            <button
              onClick={handleBuyPolicy}
              disabled={!isConnected || loading}
              style={{
                ...styles.button,
                ...styles.primaryButton,
                opacity: (!isConnected || loading) ? 0.5 : 1,
              }}
            >
              {loading ? '⏳ Processing...' : '💳 Buy Policy'}
            </button>
          </div>
        )}

        {/* Contract Info */}
        <div style={styles.infoSection}>
          <h3>ℹ️ About This Feature</h3>
          <ul style={styles.infoList}>
            <li>🔗 Policies are stored on the Polygon Amoy blockchain</li>
            <li>✅ Payouts are automatically triggered by weather data</li>
            <li>⛽ You pay a small gas fee for blockchain transactions</li>
            <li>💰 Each policy is insured for 2x the premium amount</li>
            <li>🌐 View your contracts on <a href={web3.getContractPolygonscanUrl()} target="_blank" rel="noopener noreferrer" style={styles.link}>Polygonscan</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    background: '#f9fafb',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
  },
  header: {
    marginBottom: '2rem',
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '1rem',
  },
  subtitle: {
    color: '#6b7280',
    marginTop: '0.5rem',
  },
  statusSection: {
    marginBottom: '2rem',
    padding: '1.5rem',
    borderRadius: '8px',
    background: '#f3f4f6',
  },
  connectedStatus: {
    background: '#ecfdf5',
    border: '1px solid #6ee7b7',
    borderRadius: '8px',
    padding: '1.5rem',
  },
  disconnectedStatus: {
    background: '#fef3c7',
    border: '1px solid #fcd34d',
    borderRadius: '8px',
    padding: '1.5rem',
    textAlign: 'center',
  },
  statusDetails: {
    marginTop: '1rem',
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
  alertSuccess: {
    background: '#ecfdf5',
    borderColor: '#6ee7b7',
    color: '#065f46',
  },
  txLink: {
    marginTop: '0.75rem',
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
    fontWeight: 'bold',
    borderBottom: '2px solid',
  },
  policySection: {
    marginBottom: '2rem',
    padding: '1.5rem',
    background: '#f0f9ff',
    borderRadius: '8px',
    border: '1px solid #bfdbfe',
  },
  policyDetails: {
    marginTop: '1rem',
  },
  policyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid #bfdbfe',
  },
  formSection: {
    marginBottom: '2rem',
    padding: '1.5rem',
    background: '#fef3c7',
    borderRadius: '8px',
    border: '1px solid #fcd34d',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  help: {
    display: 'block',
    marginTop: '0.25rem',
    color: '#6b7280',
    fontSize: '0.875rem',
  },
  payoutCalculation: {
    marginBottom: '1.5rem',
    padding: '1rem',
    background: 'white',
    borderRadius: '6px',
    border: '2px solid #fcd34d',
  },
  payoutRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  primaryButton: {
    width: '100%',
    background: '#3b82f6',
    color: 'white',
  },
  disconnectBtn: {
    marginTop: '1rem',
    width: '100%',
    background: '#ef4444',
    color: 'white',
  },
  infoSection: {
    paddingTop: '1.5rem',
    borderTop: '2px solid #e5e7eb',
  },
  infoList: {
    marginTop: '1rem',
    paddingLeft: '1.5rem',
    lineHeight: '1.8',
  },
};

export default BlockchainPolicyBuyer;
