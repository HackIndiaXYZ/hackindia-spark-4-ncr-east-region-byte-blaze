import * as db from '../models/database.js';

/**
 * Register or get user by wallet
 */
export async function registerUser(req, res) {
  try {
    const { walletAddress, email } = req.body;

    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address',
      });
    }

    const user = await db.createUser(walletAddress, 'farmer', email);

    res.json({
      success: true,
      data: user,
      message: 'User registered/retrieved successfully',
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user',
    });
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(req, res) {
  try {
    const walletAddress = req.walletAddress;
    const user = await db.getUserByWallet(walletAddress);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile',
    });
  }
}

/**
 * Get user's transaction history
 */
export async function getUserTransactions(req, res) {
  try {
    const walletAddress = req.walletAddress;
    const user = await db.getUserByWallet(walletAddress);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const transactions = await db.getUserTransactions(user.id);

    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions',
    });
  }
}

/**
 * Get user's purchase history
 */
export async function getUserPurchases(req, res) {
  try {
    const walletAddress = req.walletAddress;
    const user = await db.getUserByWallet(walletAddress);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const purchases = await db.getUserPurchases(user.id);

    res.json({
      success: true,
      data: purchases,
    });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch purchases',
    });
  }
}
