import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as db from '../models/database.js';

export async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password required',
      });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      { email, role: 'admin', iat: Math.floor(Date.now() / 1000) },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token,
        email,
        role: 'admin',
      },
      message: 'Admin login successful',
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
    });
  }
}

export async function farmerLogin(req, res) {
  try {
    const { walletAddress, email } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address required',
      });
    }

    // Normalize wallet address
    const normalizedAddress = walletAddress.toLowerCase();

    // Register or get user by wallet
    const user = await db.createUser(normalizedAddress, 'farmer', email);

    // Generate JWT token with wallet address
    const token = jwt.sign(
      { 
        walletAddress: normalizedAddress, 
        role: 'farmer',
        userId: user.id,
        iat: Math.floor(Date.now() / 1000) 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          walletAddress: user.wallet_address,
          email: user.email,
          role: user.role,
        },
      },
      message: 'Farmer login successful',
    });
  } catch (error) {
    console.error('Error during farmer login:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
    });
  }
}

/**
 * Verify JWT token
 */
export async function verifyToken(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token required',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    res.json({
      success: true,
      data: decoded,
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
  }
}