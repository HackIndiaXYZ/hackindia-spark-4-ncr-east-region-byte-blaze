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
