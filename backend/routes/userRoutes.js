import express from 'express';
import { authenticateWallet } from '../middleware/auth.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.post('/register', userController.registerUser);

router.get('/profile', authenticateWallet, userController.getUserProfile);

router.get('/transactions', authenticateWallet, userController.getUserTransactions);

router.get('/purchases', authenticateWallet, userController.getUserPurchases);

export default router;
