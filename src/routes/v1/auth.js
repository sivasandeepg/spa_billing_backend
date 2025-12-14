// src/routes/v1/auth.js

import express from 'express';
import { login, logout, getProfile } from '../../controllers/authController.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.get('/profile', authenticateToken, getProfile);

export default router; 