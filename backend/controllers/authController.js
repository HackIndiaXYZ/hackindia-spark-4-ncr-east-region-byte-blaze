import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as db from '../models/database.js';

/**
 * Unified Register endpoint for both Admin and Farmer
 */
export async function register(req, res) {
  try {
    const { email, password, role = 'farmer', walletAddress } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and role required',
      });
    }

    if (!['farmer', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Role must be farmer or admin',
      });
    }

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.createUserWithPassword(email, passwordHash, role, walletAddress);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email, 
        role: user.role,
        walletAddress: user.wallet_address,
        iat: Math.floor(Date.now() / 1000) 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: role === 'admin' ? '24h' : '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          walletAddress: user.wallet_address,
        },
      },
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Registration failed',
    });
  }
}

/**
 * Unified Login endpoint for both Admin and Farmer
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password required',
      });
    }

    // Get user by email
    const user = await db.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // For admin, use hardcoded credentials
    if (user.role === 'admin') {
      if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        });
      }
    } else {
      // For farmers, verify hashed password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role,
        walletAddress: user.wallet_address,
        iat: Math.floor(Date.now() / 1000) 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: user.role === 'admin' ? '24h' : '7d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          walletAddress: user.wallet_address,
        },
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
    });
  }
}

/**
 * Admin login with email and password (DEPRECATED - use login instead)
 */
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

/**
 * Farmer wallet-based login (DEPRECATED - use login instead)
 */
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