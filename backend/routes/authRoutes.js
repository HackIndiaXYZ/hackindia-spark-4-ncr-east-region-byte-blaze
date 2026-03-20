import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Unified endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);

// Legacy endpoints (for backward compatibility)
router.post('/admin/login', authController.adminLogin);
router.post('/farmer/login', authController.farmerLogin);

router.post('/verify', authController.verifyToken);

export default router;