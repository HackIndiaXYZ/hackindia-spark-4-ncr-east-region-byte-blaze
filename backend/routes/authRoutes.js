import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authController.adminLogin);

router.post('/verify', authController.verifyToken);

export default router;
