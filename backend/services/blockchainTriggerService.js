/**
 * Blockchain Trigger Service
 * ==========================
 * Connects to the Insurance smart contract on Polygon Amoy testnet
 * using ethers.js and triggers payouts based on weather conditions.
 * 
 * This is a NEW file — does NOT modify existing utils/blockchainService.js
 * 
 * Contract functions used:
 *  - getActiveFarmers() → address[]
 *  - getPolicy(farmerAddress) → Policy struct
 *  - triggerPayout(farmerAddress, rainfall) → tx
 *  - getStats() → (totalPoliciesSold, totalPayoutsTriggered, activeCount)
 *  - getContractBalance() → uint256
 */

import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== STATE ====================
let provider = null;
let wallet = null;
let contract = null;
let isReady = false;

/**
 * Load the ABI from the blockchain/abi/Insurance.json file
 */
function loadABI() {
  const abiPath = path.resolve(__dirname, '../../blockchain/abi/Insurance.json');
  if (!fs.existsSync(abiPath)) {
    throw new Error(`ABI file not found at: ${abiPath}`);
  }
  return JSON.parse(fs.readFileSync(abiPath, 'utf-8'));
}

/**
 * Initialize the blockchain connection.
 * Must be called before any other function.
 */
export async function initBlockchain() {
  const rpcUrl = process.env.RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!rpcUrl || !privateKey || !contractAddress) {
    console.warn('⚠️  Blockchain not configured — missing RPC_URL, PRIVATE_KEY, or CONTRACT_ADDRESS');
    return false;
  }

  try {
    // Connect to Polygon Amoy testnet
    provider = new ethers.JsonRpcProvider(rpcUrl);
    wallet = new ethers.Wallet(privateKey, provider);

    // Verify connection
    const network = await provider.getNetwork();
    console.log(`⛓️  Connected to chain: ${network.name} (chainId: ${network.chainId})`);
    console.log(`👛 Wallet: ${wallet.address}`);

    // Load contract
    const abi = loadABI();
    contract = new ethers.Contract(contractAddress, abi, wallet);

    isReady = true;
    console.log(`📝 Contract loaded: ${contractAddress}`);
    return true;
  } catch (error) {
    console.error('❌ Blockchain init failed:', error.message);
    isReady = false;
    return false;
  }
}

/**
 * Get all active farmer addresses from the smart contract.
 * @returns {Promise<string[]>} Array of farmer wallet addresses
 */
export async function getActiveFarmers() {
  if (!isReady) throw new Error('Blockchain not initialized');
  try {
    const farmers = await contract.getActiveFarmers();
    return farmers.map(f => f); // Convert from ethers result to plain array
  } catch (error) {
    console.error('❌ getActiveFarmers failed:', error.message);
    return [];
  }
}

/**
 * Get a farmer's policy from the smart contract.
 * @param {string} farmerAddress — 0x wallet address
 * @returns {Promise<Object>} Policy struct
 */
export async function getPolicy(farmerAddress) {
  if (!isReady) throw new Error('Blockchain not initialized');
  try {
    const policy = await contract.getPolicy(farmerAddress);
    return {
      farmer: policy.farmer,
      premium: ethers.formatEther(policy.premium),
      payout: ethers.formatEther(policy.payout),
      rainfallThreshold: Number(policy.rainfallThreshold), // mm
      active: policy.active,
      payoutClaimed: policy.payoutClaimed,
      purchaseTimestamp: new Date(Number(policy.purchaseTimestamp) * 1000).toISOString(),
    };
  } catch (error) {
    console.error(`❌ getPolicy(${farmerAddress}) failed:`, error.message);
    return null;
  }
}

/**
 * Trigger payout for a farmer on the smart contract.
 * @param {string} farmerAddress — 0x wallet address
 * @param {number} rainfall — actual rainfall in mm
 * @returns {Promise<Object>} { success, txHash, explorerUrl }
 */
export async function triggerPayout(farmerAddress, rainfall) {
  if (!isReady) throw new Error('Blockchain not initialized');

  console.log(`\n💰 Triggering payout for farmer: ${farmerAddress}`);
  console.log(`   Rainfall: ${rainfall} mm`);

  try {
    // Send transaction to smart contract
    const tx = await contract.triggerPayout(farmerAddress, Math.round(rainfall));
    console.log(`   📤 TX sent: ${tx.hash}`);

    // Wait for 1 confirmation
    const receipt = await tx.wait(1);
    const explorerUrl = `https://amoy.polygonscan.com/tx/${receipt.hash}`;

    console.log(`   ✅ TX confirmed in block ${receipt.blockNumber}`);
    console.log(`   🔗 ${explorerUrl}`);

    return {
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      explorerUrl,
    };
  } catch (error) {
    console.error(`   ❌ triggerPayout failed: ${error.message}`);

    // Check if it's a known contract revert reason
    if (error.reason) {
      console.error(`   📜 Revert reason: ${error.reason}`);
    }

    return {
      success: false,
      error: error.reason || error.message,
      txHash: null,
      explorerUrl: null,
    };
  }
}

/**
 * Get contract statistics.
 * @returns {Promise<Object>}
 */
export async function getContractStats() {
  if (!isReady) return { totalPoliciesSold: 0, totalPayoutsTriggered: 0, contractBalance: '0' };

  try {
    const [totalSold, totalPayouts, activeCount] = await contract.getStats();
    const balance = await contract.getContractBalance();

    return {
      totalPoliciesSold: Number(totalSold),
      totalPayoutsTriggered: Number(totalPayouts),
      activeFarmers: Number(activeCount),
      contractBalance: ethers.formatEther(balance),
    };
  } catch (error) {
    console.error('❌ getContractStats failed:', error.message);
    return { totalPoliciesSold: 0, totalPayoutsTriggered: 0, contractBalance: '0' };
  }
}

/**
 * Check if blockchain service is ready.
 */
export function isBlockchainReady() {
  return isReady;
}
