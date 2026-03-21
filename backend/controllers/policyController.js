import * as db from '../models/database.js';

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
    res.status(500).json({ success: false, error: 'Failed to fetch policies' });
  }
}

/**
 * Get a specific policy by ID
 */
export async function getPolicy(req, res) {
  try {
    const { policyId } = req.params;
    if (!policyId) return res.status(400).json({ success: false, error: 'Policy ID required' });

    const policy = await db.getPolicyById(policyId);
    if (!policy) return res.status(404).json({ success: false, error: 'Policy not found' });

    res.json({ success: true, data: policy });
  } catch (error) {
    console.error('Error fetching policy:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch policy' });
  }
}

/**
 * Get user's purchased policies
 */
export async function getUserPolicies(req, res) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'User ID not found in token' });

    const purchases = await db.getUserPurchases(userId);
    res.json({ success: true, data: purchases, count: purchases.length });
  } catch (error) {
    console.error('Error fetching user policies:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user policies' });
  }
}

/**
 * Get user's payout balance
 */
export async function getPayoutBalance(req, res) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'User ID not found in token' });

    const totalPayout = await db.getUserPayoutBalance(userId);
    res.json({
      success: true,
      data: { userId, totalPayout: Number(totalPayout) },
    });
  } catch (error) {
    console.error('Error fetching payout balance:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch payout balance' });
  }
}

/**
 * Purchase a policy — simplified DB-only flow (no blockchain)
 */
export async function purchasePolicy(req, res) {
  try {
    const userId = req.userId;
    const { policyId } = req.params;

    if (!userId) return res.status(401).json({ success: false, error: 'Authentication required' });
    if (!policyId) return res.status(400).json({ success: false, error: 'Policy ID required' });

    // Verify policy exists and is active
    const policy = await db.getPolicyById(policyId);
    if (!policy) return res.status(404).json({ success: false, error: 'Policy not found' });
    if (!policy.active) return res.status(400).json({ success: false, error: 'Policy is no longer active' });

    // Verify user exists
    const user = await db.getUserById(userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    // Check if user already purchased this policy
    const existingPurchases = await db.getUserPurchases(userId);
    const alreadyPurchased = existingPurchases.some(p => p.policy_id == policyId);
    if (alreadyPurchased) {
      return res.status(409).json({ success: false, error: 'You have already purchased this policy' });
    }

    // Generate a transaction reference
    const txRef = `TXN-${Date.now()}-${userId}-${policyId}`;

    // Create purchase record
    const purchase = await db.createPurchase(userId, policyId, txRef);

    // Record the transaction (amount = premium in ₹)
    await db.createTransaction(userId, txRef, 'policy_purchase', policy.premium, 'confirmed');

    // Update purchase status to active
    await db.updatePurchaseStatus(purchase.id, 'active', 0);

    console.log(`✅ Policy "${policy.name}" purchased by user ${userId} for ₹${policy.premium}`);

    res.status(201).json({
      success: true,
      data: {
        purchaseId: purchase.id,
        policyId: Number(policyId),
        policyName: policy.name,
        premium: policy.premium,
        payout: policy.payout,
        status: 'active',
        txRef,
        purchasedAt: new Date().toISOString(),
      },
      message: `Policy "${policy.name}" purchased successfully for ₹${policy.premium}`,
    });
  } catch (error) {
    console.error('Error purchasing policy:', error);
    res.status(500).json({ success: false, error: 'Failed to purchase policy' });
  }
}
