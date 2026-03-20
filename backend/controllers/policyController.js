import * as db from '../models/database.js';
import * as blockchainService from '../utils/blockchainService.js';
import { isValidPositiveNumber } from '../utils/validation.js';

/**
 * Get all available policies
 */
export async function getPolicies(req, res) {
  try {
    const policies = await db.getAllPolicies();
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
    if (!policyId) {
      return res.status(400).json({
        success: false,
        error: 'Policy ID required',
      });
    }
    const policy = await db.getPolicyById(policyId);
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        error: 'Policy not found',
      });
    }
    
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
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User ID not found in token',
      });
    }
    
    const purchases = await db.getUserPurchases(userId);

    res.json({
      success: true,
      data: purchases,
      count: purchases.length,
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
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User ID not found in token',
      });
    }

    // Use model method instead of raw query
    const totalPayoutWei = await db.getUserPayoutBalance(userId);
    
    const totalPayoutETH = (BigInt(totalPayoutWei || 0) / BigInt(10n ** 18n)).toString();

    res.json({
      success: true,
      data: {
        userId,
        totalPayoutWei: totalPayoutWei?.toString() || '0',
        totalPayoutETH,
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

/**
 * Purchase a policy (with blockchain execution)
 */
export async function purchasePolicy(req, res) {
  try {
    const userId = req.userId;
    const { policyId, walletAddress } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User ID not found in token',
      });
    }

    if (!policyId) {
      return res.status(400).json({
        success: false,
        error: 'Policy ID required',
      });
    }

    // Verify policy exists
    const policy = await db.getPolicyById(policyId);
    if (!policy) {
      return res.status(404).json({
        success: false,
        error: 'Policy not found',
      });
    }

    // Verify user exists
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Use wallet from token if not provided in request
    const farmerWallet = walletAddress || user.wallet_address;
    if (!farmerWallet) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address required',
      });
    }

    // Create purchase record in database
    const txHash = `tx_${Date.now()}_${userId}`;
    const purchase = await db.createPurchase(userId, policyId, txHash);

    // Execute blockchain transaction
    try {
      console.log(`📝 Executing blockchain transaction for purchase ${purchase.id}...`);
      
      // Call blockchain service to execute the policy purchase on-chain
      const result = await blockchainService.executePolicyPurchase(
        farmerWallet,
        policyId,
        policy.premium
      );

      if (result && result.txHash) {
        // Update purchase with blockchain transaction hash
        await db.updatePurchaseStatus(purchase.id, 'pending_confirmation', 0);
        
        // Record the blockchain transaction
        await db.createTransaction(
          userId,
          result.txHash,
          'policy_purchase',
          policy.premium,
          'pending'
        );

        console.log(`✅ Blockchain transaction successful: ${result.txHash}`);

        return res.status(201).json({
          success: true,
          data: {
            purchaseId: purchase.id,
            policyId,
            userId,
            status: 'pending_confirmation',
            txHash: result.txHash,
            premium: policy.premium,
            payout: policy.payout,
            createdAt: purchase.created_at,
          },
          message: 'Policy purchase initiated successfully',
        });
      } else {
        return res.status(500).json({
          success: false,
          error: 'Blockchain transaction failed',
        });
      }
    } catch (blockchainError) {
      console.warn('⚠️  Blockchain execution failed, but purchase record created:', blockchainError.message);
      
      // Purchase record is created but blockchain execution failed
      return res.status(201).json({
        success: true,
        data: {
          purchaseId: purchase.id,
          policyId,
          userId,
          status: 'created',
          premium: policy.premium,
          payout: policy.payout,
          createdAt: purchase.created_at,
          blockchainWarning: 'Blockchain execution failed - will retry in background',
        },
        message: 'Policy purchased successfully (blockchain pending)',
      });
    }
  } catch (error) {
    console.error('Error purchasing policy:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to purchase policy',
    });
  }
}
