/**
 * Web3 Utility for InsuChain Frontend
 * Handles MetaMask connection, smart contract interactions, and Web3 operations
 */

import { BrowserProvider, Contract, parseEther } from 'ethers';

// Contract configuration
let contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
let contractABI = null;
let provider = null;
let signer = null;
let contract = null;
let userAddress = null;

/**
 * Load contract ABI from the blockchain module
 * This should be copied to public folder during build
 */
async function loadContractABI() {
  try {
    const response = await fetch('/abi/Insurance.json');
    if (!response.ok) {
      throw new Error(`Failed to load ABI: ${response.statusText}`);
    }
    contractABI = await response.json();
    return contractABI;
  } catch (error) {
    console.error('❌ Error loading contract ABI:', error.message);
    throw error;
  }
}

/**
 * Initialize Web3 connection (must be called first)
 * Checks if MetaMask is installed and initializes provider
 */
export async function initializeWeb3() {
  try {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install it to continue.');
    }

    // Load contract ABI
    if (!contractABI) {
      await loadContractABI();
    }

    if (!contractAddress) {
      throw new Error('Contract address not configured. Check your .env file.');
    }

    // Initialize provider
    provider = new BrowserProvider(window.ethereum);

    console.log('✅ Web3 initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing Web3:', error.message);
    throw error;
  }
}

/**
 * Connect MetaMask wallet
 * Returns user's wallet address or null if connection fails
 */
export async function connectWallet() {
  try {
    if (!provider) {
      throw new Error('Web3 not initialized. Call initializeWeb3() first.');
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }

    userAddress = accounts[0];
    signer = await provider.getSigner();

    // Initialize contract with signer for write operations
    if (!contract) {
      contract = new Contract(contractAddress, contractABI, signer);
    }

    console.log('✅ Wallet connected:', userAddress);
    return userAddress;
  } catch (error) {
    console.error('❌ Error connecting wallet:', error.message);
    throw error;
  }
}

/**
 * Disconnect wallet
 */
export function disconnectWallet() {
  userAddress = null;
  signer = null;
  contract = null;
  console.log('✅ Wallet disconnected');
}

/**
 * Get the connected wallet address
 */
export function getConnectedAddress() {
  return userAddress;
}

/**
 * Check if wallet is connected
 */
export function isConnected() {
  return userAddress !== null && userAddress !== undefined;
}

/**
 * Check if user is on the correct network (Polygon Amoy)
 * Polygon Amoy Chain ID: 80002
 */
export async function checkNetwork() {
  try {
    if (!provider) {
      throw new Error('Web3 not initialized');
    }

    const network = await provider.getNetwork();
    const correctChainId = 80002; // Polygon Amoy

    if (network.chainId !== correctChainId) {
      throw new Error(
        `Wrong network! Connected to ${network.name} (${network.chainId}). Please switch to Polygon Amoy (80002).`
      );
    }

    console.log(`✅ Connected to correct network: ${network.name}`);
    return true;
  } catch (error) {
    console.error('❌ Network check failed:', error.message);
    throw error;
  }
}

/**
 * Switch to Polygon Amoy network
 */
export async function switchToAmoyNetwork() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x13882' }], // 80002 in hex
    });
    console.log('✅ Switched to Polygon Amoy');
    return true;
  } catch (error) {
    if (error.code === 4902) {
      // Network not added to MetaMask
      console.log('📝 Adding Polygon Amoy to MetaMask...');
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x13882',
              chainName: 'Polygon Amoy',
              rpcUrls: ['https://rpc-amoy.polygon.technology/'],
              nativeCurrency: {
                name: 'Polygon',
                symbol: 'MATIC',
                decimals: 18,
              },
              blockExplorerUrls: ['https://amoy.polygonscan.com/'],
            },
          ],
        });
        console.log('✅ Polygon Amoy added to MetaMask');
        return true;
      } catch (addError) {
        console.error('❌ Failed to add network:', addError.message);
        throw addError;
      }
    } else {
      throw error;
    }
  }
}

/**
 * Buy an insurance policy
 * @param {number} rainfallThreshold - Rainfall threshold in mm
 * @param {string} premiumAmount - Premium amount in MATIC
 * @returns {Object} Transaction details
 */
export async function buyPolicy(rainfallThreshold, premiumAmount) {
  try {
    if (!contract || !signer) {
      throw new Error('Wallet not connected. Call connectWallet() first.');
    }

    if (!rainfallThreshold || rainfallThreshold <= 0) {
      throw new Error('Invalid rainfall threshold');
    }

    if (!premiumAmount || premiumAmount <= 0) {
      throw new Error('Invalid premium amount');
    }

    console.log('\n📝 Buying insurance policy...');
    console.log(`   Rainfall Threshold: ${rainfallThreshold} mm`);
    console.log(`   Premium Amount: ${premiumAmount} MATIC`);

    // Convert MATIC to wei
    const premiumInWei = parseEther(premiumAmount.toString());

    // Call contract function
    const tx = await contract.buyPolicy(rainfallThreshold, {
      value: premiumInWei,
    });

    console.log(`   📤 Transaction sent: ${tx.hash}`);
    console.log(`   ⏳ Waiting for confirmation...`);

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    console.log(`   ✅ Transaction confirmed!`);
    console.log(`   Block Number: ${receipt.blockNumber}`);
    console.log(`   Gas Used: ${receipt.gasUsed.toString()}`);

    return {
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status,
      gasUsed: receipt.gasUsed.toString(),
      farmer: userAddress,
      rainfallThreshold,
      premium: premiumAmount,
      payout: (parseFloat(premiumAmount) * 2).toString(),
    };
  } catch (error) {
    console.error('❌ Error buying policy:', error.message);
    throw error;
  }
}

/**
 * Get policy details for the connected user
 * @returns {Object} Policy details
 */
export async function getMyPolicy() {
  try {
    if (!userAddress) {
      throw new Error('Wallet not connected');
    }

    if (!contract && provider) {
      // If no signer contract, create read-only contract
      const readOnlyContract = new Contract(contractAddress, contractABI, provider);
      const policy = await readOnlyContract.getPolicy(userAddress);
      
      return {
        farmer: policy.farmer,
        premium: policy.premium.toString(),
        payout: policy.payout.toString(),
        rainfallThreshold: policy.rainfallThreshold.toString(),
        active: policy.active,
        payoutClaimed: policy.payoutClaimed,
        purchaseTimestamp: policy.purchaseTimestamp.toString(),
      };
    } else if (contract) {
      const policy = await contract.getPolicy(userAddress);
      
      return {
        farmer: policy.farmer,
        premium: policy.premium.toString(),
        payout: policy.payout.toString(),
        rainfallThreshold: policy.rainfallThreshold.toString(),
        active: policy.active,
        payoutClaimed: policy.payoutClaimed,
        purchaseTimestamp: policy.purchaseTimestamp.toString(),
      };
    }
  } catch (error) {
    console.error('❌ Error getting policy:', error.message);
    throw error;
  }
}

/**
 * Check if user has an active policy
 * @returns {boolean} True if user has active policy
 */
export async function hasActivePolicy() {
  try {
    if (!userAddress) return false;

    const readOnlyContract = new Contract(contractAddress, contractABI, provider);
    return await readOnlyContract.hasPolicyActive(userAddress);
  } catch (error) {
    console.error('❌ Error checking active policy:', error.message);
    return false;
  }
}

/**
 * Get contract statistics
 * @returns {Object} Contract stats
 */
export async function getContractStats() {
  try {
    const readOnlyContract = new Contract(contractAddress, contractABI, provider);
    const [totalPolicies, totalPayouts, balance] = await readOnlyContract.getStats();

    return {
      totalPoliciesSold: totalPolicies.toString(),
      totalPayoutsTriggered: totalPayouts.toString(),
      contractBalanceWei: balance.toString(),
      contractBalance: (parseFloat(balance.toString()) / 1e18).toFixed(4), // Convert to MATIC
    };
  } catch (error) {
    console.error('❌ Error getting contract stats:', error.message);
    throw error;
  }
}

/**
 * Get wallet balance
 * @returns {Object} Wallet balance in MATIC and Wei
 */
export async function getWalletBalance() {
  try {
    if (!userAddress) {
      throw new Error('Wallet not connected');
    }

    const balanceWei = await provider.getBalance(userAddress);
    const balanceMatic = (parseFloat(balanceWei.toString()) / 1e18).toFixed(4);

    return {
      address: userAddress,
      balanceMatic,
      balanceWei: balanceWei.toString(),
    };
  } catch (error) {
    console.error('❌ Error getting wallet balance:', error.message);
    throw error;
  }
}

/**
 * Listen for PayoutTriggered events for the connected user
 * @param {Function} callback - Callback function to handle events
 * @returns {Function} Unsubscribe function
 */
export function listenForPayouts(callback) {
  try {
    if (!provider) {
      throw new Error('Web3 not initialized');
    }

    const readOnlyContract = new Contract(contractAddress, contractABI, provider);
    const anotherFilter = readOnlyContract.filters.PayoutTriggered();

    // Listen for events where this user is the farmer
    const listener = (farmer, payoutAmount, rainfall, threshold, timestamp, event) => {
      if (farmer.toLowerCase() === userAddress.toLowerCase()) {
        console.log('🎉 Payout triggered event received!');
        
        if (callback) {
          callback({
            farmer,
            payoutAmount: (parseFloat(payoutAmount.toString()) / 1e18).toFixed(4),
            payoutAmountWei: payoutAmount.toString(),
            rainfall: rainfall.toString(),
            threshold: threshold.toString(),
            timestamp: new Date(parseInt(timestamp.toString()) * 1000).toISOString(),
            transactionHash: event.transactionHash,
          });
        }
      }
    };

    readOnlyContract.on(anotherFilter, listener);

    // Return unsubscribe function
    return () => {
      readOnlyContract.removeListener(anotherFilter, listener);
      console.log('⏹️  Stopped listening for payout events');
    };
  } catch (error) {
    console.error('❌ Error setting up event listener:', error.message);
    throw error;
  }
}

/**
 * Format Wei to MATIC
 * @param {string|number} wei - Amount in Wei
 * @returns {string} Amount in MATIC
 */
export function formatWeiToMatic(wei) {
  return (parseFloat(wei.toString()) / 1e18).toFixed(4);
}

/**
 * Get transaction status by hash
 * @param {string} transactionHash - Transaction hash
 * @returns {Object} Transaction status details
 */
export async function getTransactionStatus(transactionHash) {
  try {
    const tx = await provider.getTransaction(transactionHash);
    const receipt = await provider.getTransactionReceipt(transactionHash);

    if (!receipt) {
      return {
        status: 'pending',
        hash: transactionHash,
        message: 'Transaction is pending. Please wait...',
      };
    }

    return {
      status: receipt.status === 1 ? 'confirmed' : 'failed',
      hash: transactionHash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      confirmations: (await provider.getBlockNumber()) - receipt.blockNumber,
    };
  } catch (error) {
    console.error('❌ Error getting transaction status:', error.message);
    throw error;
  }
}

/**
 * Get Polygonscan URL for a transaction
 * @param {string} hash - Transaction hash
 * @returns {string} Polygonscan URL
 */
export function getPolygonscanUrl(hash) {
  return `https://amoy.polygonscan.com/tx/${hash}`;
}

/**
 * Get contract Polygonscan URL
 * @returns {string} Polygonscan contract URL
 */
export function getContractPolygonscanUrl() {
  return `https://amoy.polygonscan.com/address/${contractAddress}`;
}

export default {
  initializeWeb3,
  connectWallet,
  disconnectWallet,
  getConnectedAddress,
  isConnected,
  checkNetwork,
  switchToAmoyNetwork,
  buyPolicy,
  getMyPolicy,
  hasActivePolicy,
  getContractStats,
  getWalletBalance,
  listenForPayouts,
  formatWeiToMatic,
  getTransactionStatus,
  getPolygonscanUrl,
  getContractPolygonscanUrl,
};
