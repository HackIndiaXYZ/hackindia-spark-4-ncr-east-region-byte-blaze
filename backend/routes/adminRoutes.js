import express from 'express';
import { authenticateJWT, requireAdmin } from '../middlewares/auth.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require auth + admin role
router.get('/dashboard', authenticateJWT, requireAdmin, adminController.getDashboardStats);
router.get('/users', authenticateJWT, requireAdmin, adminController.getAllUsers);
router.get('/purchases', authenticateJWT, requireAdmin, adminController.getAllPurchases);
router.post('/policies/create', authenticateJWT, requireAdmin, adminController.createPolicy);
router.put('/policies/:id', authenticateJWT, requireAdmin, adminController.updatePolicy);
router.delete('/policies/:id', authenticateJWT, requireAdmin, adminController.deletePolicy);
router.post('/payouts/trigger', authenticateJWT, requireAdmin, adminController.triggerPayoutByWeather);

export default router;