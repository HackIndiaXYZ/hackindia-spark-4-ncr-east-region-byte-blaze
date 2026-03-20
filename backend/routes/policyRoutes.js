import express from 'express';
import { authenticateWallet } from '../middleware/auth.js';
import * as policyController from '../controllers/policyController.js';

const router = express.Router();

router.get('/', policyController.getPolicies);

router.get('/:policyId', policyController.getPolicy);

router.get('/user/mypolicies', authenticateWallet, policyController.getUserPolicies);

router.get('/user/payout', authenticateWallet, policyController.getPayoutBalance);

export default router;
