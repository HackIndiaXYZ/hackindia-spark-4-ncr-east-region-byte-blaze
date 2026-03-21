// Mock/Adapter for Blockchain Service to allow the server to run locally
// since the original file was replaced by a deployment script.

import { ethers } from 'ethers';
import { contractManager } from './contractManager.js';

let isInitialized = false;

export async function initializeBlockchain() {
  console.log('🔗 Initializing Blockchain Service...');
  isInitialized = true;
  return true;
}

export async function executePolicyPurchase(userId, policyId, premium) {
  console.log(`💳 Executing policy purchase on chain for User ${userId}, Policy ${policyId}`);
  return { success: true, txHash: '0x' + Math.random().toString(16).slice(2, 64) };
}

export async function getActiveFarmersFromChain() {
  return [
    { address: '0x123...abc', policyId: 1, active: true },
    { address: '0x456...def', policyId: 2, active: true }
  ];
}

export async function getContractStats() {
  return {
    totalPolicies: 5,
    totalFarmers: 12,
    totalPayouts: (2.5 * 10**18).toString(),
    contractBalance: (10.0 * 10**18).toString()
  };
}

export async function getPolicyFromChain(farmerAddress) {
  return {
    id: 1,
    name: "Mock Rainfall Policy",
    premium: (0.5 * 10**18).toString(),
    payout: (5.0 * 10**18).toString(),
    active: true
  };
}

export async function triggerPayoutOnChain(farmerAddress, policyId, rainfall, temperature) {
  console.log(`💰 Triggering payout for ${farmerAddress}. Rain: ${rainfall}, Temp: ${temperature}`);
  return { success: true, txHash: '0x' + Math.random().toString(16).slice(2, 64), amount: (5.0 * 10**18).toString() };
}