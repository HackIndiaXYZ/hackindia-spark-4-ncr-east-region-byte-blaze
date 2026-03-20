import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

router.post('/policies/create', authenticateJWT, adminController.createPolicy);

router.get('/users', authenticateJWT, adminController.getAllUsers);


router.get('/dashboard', authenticateJWT, adminController.getDashboardStats);

router.post('/payouts/trigger', authenticateJWT, adminController.triggerPayoutByWeather);

export default router;
