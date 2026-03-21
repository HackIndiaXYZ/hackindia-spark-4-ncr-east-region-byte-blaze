import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as db from '../models/database.js';

/**
 * Register — works for both farmer and admin
 */
export async function register(req, res) {
  try {
    const { email, password, role = 'farmer', walletAddress } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }
    if (role && !['farmer', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Role must be farmer or admin' });
    }

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.createUserWithPassword(email, passwordHash, role, walletAddress);

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, walletAddress: user.wallet_address },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: role === 'admin' ? '24h' : '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, role: user.role, walletAddress: user.wallet_address },
      },
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: error.message || 'Registration failed' });
  }
}

/**
 * Login — works for both farmer and admin
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Verify password (bcrypt for all users)
    if (!user.password_hash) {
      return res.status(401).json({ success: false, error: 'Account has no password set. Please re-register.' });
    }
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, walletAddress: user.wallet_address },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: user.role === 'admin' ? '24h' : '7d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, role: user.role, walletAddress: user.wallet_address },
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
}

/**
 * Verify JWT token
 */
export async function verifyToken(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, error: 'Token required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ success: true, data: decoded });
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
}