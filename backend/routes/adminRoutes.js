import express from 'express';
import { authenticateJWT } from '../middlewares/auth.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// All admin routes are protected
router.post('/policies/create', authenticateJWT, adminController.createPolicy);
router.get('/users', authenticateJWT, adminController.getAllUsers);
router.get('/dashboard', authenticateJWT, adminController.getDashboardStats);
router.post('/payouts/trigger', authenticateJWT, adminController.triggerPayoutByWeather);

export default router;