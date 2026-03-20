import express from 'express';
import { authenticateJWT } from '../middlewares/auth.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// Farmer registration & authentication
router.post('/register', userController.registerUser);

// Protected routes (farmers only)
router.get('/profile', authenticateJWT, userController.getUserProfile);
router.get('/transactions', authenticateJWT, userController.getUserTransactions);
router.get('/purchases', authenticateJWT, userController.getUserPurchases);

export default router;