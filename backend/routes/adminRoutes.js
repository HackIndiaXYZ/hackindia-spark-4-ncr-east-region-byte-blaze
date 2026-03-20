import express from 'express';
import { authenticateJWT, requireAdmin } from '../middlewares/auth.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// All admin routes are protected - require both authentication and admin role
router.post('/policies/create', authenticateJWT, requireAdmin, adminController.createPolicy);
router.get('/users', authenticateJWT, requireAdmin, adminController.getAllUsers);
router.get('/dashboard', authenticateJWT, requireAdmin, adminController.getDashboardStats);
router.post('/payouts/trigger', authenticateJWT, requireAdmin, adminController.triggerPayoutByWeather);

export default router;