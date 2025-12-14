// src/routes/v1/combo.js

import express from 'express';
import { 
  getCombos, 
  getComboById, 
  addCombo, 
  updateCombo, 
  deleteCombo, 
  updateComboStatus 
} from '../../controllers/comboController.js';
import { authenticateToken, authorize } from '../../middleware/auth.js';

const router = express.Router();

// Get all combos (filtered by user role and branch)
router.get('/', 
  authenticateToken, 
  authorize(['admin', 'manager', 'pos']), 
  getCombos
);

// Get combo by ID
router.get('/:id', 
  authenticateToken, 
  authorize(['admin', 'manager', 'pos']), 
  getComboById
);

// Create new combo
router.post('/', 
  authenticateToken, 
  authorize(['admin', 'manager']), 
  addCombo
);

// Update combo
router.put('/:id', 
  authenticateToken, 
  authorize(['admin', 'manager']), 
  updateCombo
);

// Update combo status only
router.patch('/:id/status', 
  authenticateToken, 
  authorize(['admin', 'manager']), 
  updateComboStatus
);

// Delete combo
router.delete('/:id', 
  authenticateToken, 
  authorize(['admin', 'manager']), 
  deleteCombo
);

export default router;  