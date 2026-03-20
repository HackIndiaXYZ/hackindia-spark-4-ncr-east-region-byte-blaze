import { contractManager } from '../utils/contractManager.js';
import * as db from '../models/database.js';

/**
 * Get all available policies
 */
export async function getPolicies(req, res) {
  try {
    const policies = await contractManager.getAllPolicies();
    res.json({
      success: true,
      data: policies,
      count: policies.length,
    });
  } catch (error) {
    console.error('Error fetching policies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch policies',
    });
  }
}

/**
 * Get a specific policy by ID
 */
export async function getPolicy(req, res) {
  try {
    const { policyId } = req.params;
    const policy = await contractManager.contract.getPolicy(policyId);
    res.json({
      success: true,
      data: policy,
    });
  } catch (error) {
    console.error('Error fetching policy:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch policy',
    });
  }
}

/**
 * Get user's purchased policies
 */
export async function getUserPolicies(req, res) {
  try {
    const walletAddress = req.walletAddress;
    
    // Get from contract
    const contractPolicies = await contractManager.getUserPolicies(walletAddress);
    
    // Get from database for additional info
    const user = await db.getUserByWallet(walletAddress);
    const dbPurchases = user ? await db.getUserPurchases(user.id) : [];

    res.json({
      success: true,
      data: {
        contractPolicies,
        purchases: dbPurchases,
      },
    });
  } catch (error) {
    console.error('Error fetching user policies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user policies',
    });
  }
}

/**
 * Get user's payout balance
 */
export async function getPayoutBalance(req, res) {
  try {
    const walletAddress = req.walletAddress;
    const balance = await contractManager.getPayoutBalance(walletAddress);
    
    res.json({
      success: true,
      data: {
        walletAddress,
        balanceWei: balance,
        balanceETH: (BigInt(balance) / BigInt(10 ** 18)).toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching payout balance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payout balance',
    });
  }
}
