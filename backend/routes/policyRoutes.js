import express from 'express';
import { authenticateJWT } from '../middlewares/auth.js';
import * as policyController from '../controllers/policyController.js';

const router = express.Router();

// Public routes
router.get('/', policyController.getPolicies);
router.get('/:policyId', policyController.getPolicy);

// Protected routes (farmers only)
router.get('/user/mypolicies', authenticateJWT, policyController.getUserPolicies);
router.get('/user/payout', authenticateJWT, policyController.getPayoutBalance);
router.post('/purchase/:policyId', authenticateJWT, policyController.purchasePolicy);

export default router;