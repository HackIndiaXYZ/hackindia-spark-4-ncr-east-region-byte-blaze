import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/admin/login', authController.adminLogin);

router.post('/farmer/login', authController.farmerLogin);

router.post('/verify', authController.verifyToken);

export default router;