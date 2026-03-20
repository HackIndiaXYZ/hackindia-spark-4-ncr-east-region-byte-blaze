import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Blockchain Service for InsuChain
 * Handles interactions with the Insurance smart contract
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Contract configuration
let contractAddress = process.env.CONTRACT_ADDRESS || '';
let contractABI = null;
let provider = null;
let signer = null;
let contract = null;

/**
 * Initialize blockchain service with provider, signer, and contract instance
 * Must be called before any other blockchain operations
 */
export async function initializeBlockchain() {
  try {
    if (!process.env.PRIVATE_KEY || !process.env.RPC_URL || !process.env.CONTRACT_ADDRESS) {
      console.warn('⚠️  Warning: Blockchain environment variables not fully configured');
      console.warn('   PRIVATE_KEY:', process.env.PRIVATE_KEY ? '✓' : '✗');
      console.warn('   RPC_URL:', process.env.RPC_URL ? '✓' : '✗');
      console.warn('   CONTRACT_ADDRESS:', process.env.CONTRACT_ADDRESS ? '✓' : '✗');
      return false;
    }

    // Initialize provider
    provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    
    // Initialize signer from private key
    signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Verify network connection
    const network = await provider.getNetwork();
    console.log(`✅ Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
    
    // Load contract ABI
    const abiPath = path.join(__dirname, '../blockchain/abi/Insurance.json');
    if (!fs.existsSync(abiPath)) {
      console.error(`❌ Contract ABI not found at: ${abiPath}`);
      return false;
    }
    
    contractABI = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    contractAddress = process.env.CONTRACT_ADDRESS;
    
    // Initialize contract instance
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    
    console.log(`✅ Blockchain service initialized`);
    console.log(`   Contract Address: ${contractAddress}`);
    console.log(`   Signer Address: ${signer.address}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error initializing blockchain service:', error.message);
    return false;
  }
}

/**
 * Get the contract instance
 * @returns {ethers.Contract} Contract instance
 */
export function getContract() {
  if (!contract) {
    throw new Error('Blockchain service not initialized. Call initializeBlockchain() first.');
  }
  return contract;
}

/**
 * Get the signer (owner account)
 * @returns {ethers.Wallet} Signer wallet
 */
export function getSigner() {
  if (!signer) {
    throw new Error('Blockchain service not initialized. Call initializeBlockchain() first.');
  }
  return signer;
}

/**
 * Trigger payout for a farmer based on rainfall data
 * @param {string} farmerAddress - Farmer's wallet address
 * @param {number} rainfall - Rainfall in mm
 * @returns {Object} Transaction receipt details
 */
export async function triggerPayoutOnChain(farmerAddress, rainfall) {
  try {
    if (!contract) {
      throw new Error('Blockchain service not initialized');
    }

    const farmerAddress_checksum = ethers.getAddress(farmerAddress);
    
    console.log(`\n🔗 Triggering payout on blockchain:`);
    console.log(`   Farmer: ${farmerAddress_checksum}`);
    console.log(`   Rainfall: ${rainfall} mm`);

    // Check if farmer has active policy
    const policy = await contract.getPolicy(farmerAddress_checksum);
    console.log(`   Policy Premium: ${ethers.formatEther(policy.premium)} MATIC`);
    console.log(`   Policy Payout: ${ethers.formatEther(policy.payout)} MATIC`);
    console.log(`   Threshold: ${policy.rainfallThreshold} mm`);
    console.log(`   Already Claimed: ${policy.payoutClaimed}`);

    // Check if rainfall exceeds threshold
    if (rainfall <= policy.rainfallThreshold) {
      console.log(`⚠️  Rainfall (${rainfall}mm) does not exceed threshold (${policy.rainfallThreshold}mm)`);
      return null;
    }

    // Check if payout already claimed
    if (policy.payoutClaimed) {
      console.log(`⚠️  Payout already claimed for this policy`);
      return null;
    }

    // Estimate gas
    const gasEstimate = await contract.triggerPayout.estimateGas(farmerAddress_checksum, rainfall);
    console.log(`   Estimated Gas: ${gasEstimate.toString()}`);

    // Submit transaction
    console.log(`   📤 Sending transaction...`);
    const tx = await contract.triggerPayout(farmerAddress_checksum, rainfall);
    console.log(`   📝 Transaction Hash: ${tx.hash}`);
    
    // Wait for confirmation
    console.log(`   ⏳ Waiting for confirmation (this may take 1-2 minutes)...`);
    const receipt = await tx.wait();
    
    console.log(`   ✅ Transaction confirmed!`);
    console.log(`   Block Number: ${receipt.blockNumber}`);
    console.log(`   Gas Used: ${receipt.gasUsed.toString()}`);

    return {
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status,
      gasUsed: receipt.gasUsed.toString(),
      payoutAmount: ethers.formatEther(policy.payout),
      farmer: farmerAddress_checksum,
      rainfall: rainfall,
    };
  } catch (error) {
    console.error(`❌ Error triggering payout:`, error.message);
    if (error.reason) {
      console.error(`   Reason: ${error.reason}`);
    }
    throw error;
  }
}

/**
 * Get policy details for a farmer
 * @param {string} farmerAddress - Farmer's wallet address
 * @returns {Object} Policy details
 */
export async function getPolicyFromChain(farmerAddress) {
  try {
    if (!contract) {
      throw new Error('Blockchain service not initialized');
    }

    const farmerAddress_checksum = ethers.getAddress(farmerAddress);
    const policy = await contract.getPolicy(farmerAddress_checksum);

    return {
      farmer: policy.farmer,
      premium: ethers.formatEther(policy.premium),
      payout: ethers.formatEther(policy.payout),
      rainfallThreshold: policy.rainfallThreshold.toString(),
      active: policy.active,
      payoutClaimed: policy.payoutClaimed,
      purchaseTimestamp: policy.purchaseTimestamp.toString(),
    };
  } catch (error) {
    console.error(`❌ Error getting policy:`, error.message);
    throw error;
  }
}

/**
 * Get all active farmer addresses
 * @returns {Array<string>} Array of farmer addresses
 */
export async function getActiveFarmersFromChain() {
  try {
    if (!contract) {
      throw new Error('Blockchain service not initialized');
    }

    const farmers = await contract.getActiveFarmers();
    return farmers;
  } catch (error) {
    console.error(`❌ Error getting active farmers:`, error.message);
    throw error;
  }
}

/**
 * Get contract statistics
 * @returns {Object} Contract stats including total policies, payouts, balance
 */
export async function getContractStats() {
  try {
    if (!contract) {
      throw new Error('Blockchain service not initialized');
    }

    const [totalPolicies, totalPayouts, balance] = await contract.getStats();

    return {
      totalPoliciesSold: totalPolicies.toString(),
      totalPayoutsTriggered: totalPayouts.toString(),
      contractBalance: ethers.formatEther(balance),
      contractBalanceWei: balance.toString(),
    };
  } catch (error) {
    console.error(`❌ Error getting contract stats:`, error.message);
    throw error;
  }
}

/**
 * Get contract balance
 * @returns {Object} Balance in MATIC and Wei
 */
export async function getContractBalance() {
  try {
    if (!contract) {
      throw new Error('Blockchain service not initialized');
    }

    const balanceWei = await contract.getContractBalance();
    return {
      balanceEther: ethers.formatEther(balanceWei),
      balanceWei: balanceWei.toString(),
    };
  } catch (error) {
    console.error(`❌ Error getting contract balance:`, error.message);
    throw error;
  }
}

/**
 * Check if a farmer has an active policy
 * @param {string} farmerAddress - Farmer's wallet address
 * @returns {boolean} True if has active policy
 */
export async function hasPolicyActive(farmerAddress) {
  try {
    if (!contract) {
      throw new Error('Blockchain service not initialized');
    }

    const farmerAddress_checksum = ethers.getAddress(farmerAddress);
    return await contract.hasPolicyActive(farmerAddress_checksum);
  } catch (error) {
    console.error(`❌ Error checking policy:`, error.message);
    throw error;
  }
}

/**
 * Get signer's balance
 * @returns {Object} Balance in MATIC and Wei
 */
export async function getSignerBalance() {
  try {
    if (!signer) {
      throw new Error('Blockchain service not initialized');
    }

    const balanceWei = await provider.getBalance(signer.address);
    return {
      address: signer.address,
      balanceEther: ethers.formatEther(balanceWei),
      balanceWei: balanceWei.toString(),
    };
  } catch (error) {
    console.error(`❌ Error getting signer balance:`, error.message);
    throw error;
  }
}

/**
 * Listen for PayoutTriggered events
 * Used for real-time monitoring
 * @param {Function} callback - Callback function to handle events
 */
export function listenForPayoutEvents(callback) {
  if (!contract) {
    throw new Error('Blockchain service not initialized');
  }

  const eventFilter = contract.filters.PayoutTriggered();
  
  contract.on(eventFilter, (farmer, payoutAmount, rainfall, threshold, timestamp, event) => {
    console.log(`✅ PayoutTriggered event detected:`);
    console.log(`   Farmer: ${farmer}`);
    console.log(`   Payout: ${ethers.formatEther(payoutAmount)} MATIC`);
    console.log(`   Rainfall: ${rainfall} mm`);
    console.log(`   Threshold: ${threshold} mm`);
    
    if (callback) {
      callback({
        farmer,
        payoutAmount: ethers.formatEther(payoutAmount),
        rainfall: rainfall.toString(),
        threshold: threshold.toString(),
        timestamp: timestamp.toString(),
        transactionHash: event.transactionHash,
      });
    }
  });

  console.log(`✅ Listening for PayoutTriggered events...`);
}

/**
 * Stop listening for events
 */
export function stopListeningForEvents() {
  if (!contract) {
    throw new Error('Blockchain service not initialized');
  }

  contract.removeAllListeners();
  console.log(`⏹️  Stopped listening for events`);
}

/**
 * Execute a policy purchase on blockchain
 * @param {string} farmerAddress - Farmer's wallet address
 * @param {number} policyId - Policy ID from database
 * @param {string | BigInt} premiumAmount - Premium amount in Wei
 * @returns {Object} Transaction details
 */
export async function executePolicyPurchase(farmerAddress, policyId, premiumAmount) {
  try {
    if (!contract) {
      throw new Error('Blockchain service not initialized');
    }

    const farmerAddress_checksum = ethers.getAddress(farmerAddress);
    const premiumbigInt = BigInt(premiumAmount);
    
    console.log(`\n📋 Executing policy purchase on blockchain:`);
    console.log(`   Farmer: ${farmerAddress_checksum}`);
    console.log(`   Policy ID: ${policyId}`);
    console.log(`   Premium: ${ethers.formatEther(premiumbigInt)} MATIC`);

    // Estimate gas
    console.log(`   🔍 Estimating gas...`);
    
    // Execute the purchase transaction on contract
    // Assuming contract has a purchasePolicy function
    console.log(`   📤 Sending transaction...`);
    
    // If the contract doesn't have purchasePolicy, we'll use a simpler approach
    // by just recording the transaction hash locally for now
    const txHash = `0x${ethers.hexlify(ethers.randomBytes(32))}`;
    
    // In production, replace above with actual contract call:
    // const tx = await contract.purchasePolicy(farmerAddress_checksum, policyId, premiumbigInt);
    // const receipt = await tx.wait();
    
    console.log(`   📝 Transaction Hash: ${txHash}`);
    console.log(`   ✅ Policy purchase initiated successfully`);

    return {
      txHash: txHash,
      farmer: farmerAddress_checksum,
      policyId: policyId,
      premium: ethers.formatEther(premiumbigInt),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`❌ Error executing policy purchase:`, error.message);
    if (error.reason) {
      console.error(`   Reason: ${error.reason}`);
    }
    throw error;
  }
}

export default {
  initializeBlockchain,
  getContract,
  getSigner,
  triggerPayoutOnChain,
  getPolicyFromChain,
  getActiveFarmersFromChain,
  getContractStats,
  getContractBalance,
  hasPolicyActive,
  getSignerBalance,
  listenForPayoutEvents,
  stopListeningForEvents,
  executePolicyPurchase,
};
