// src/routes/v1/pos.js

import express from 'express';
import { authenticateToken, authorize } from '../../middleware/auth.js';
import { addCustomer, addTransaction, getTransactions, getCustomers } from '../../controllers/posController.js';

const router = express.Router();
   
router.post('/customers', authenticateToken, authorize(['pos', 'manager', 'admin']), addCustomer);
router.get('/customers', authenticateToken, authorize(['pos', 'manager', 'admin']), getCustomers); 
router.post('/transactions', authenticateToken, authorize(['pos', 'manager', 'admin']), addTransaction);
router.get('/transactions', authenticateToken, authorize(['pos', 'manager', 'admin']), getTransactions);

export default router; 

  