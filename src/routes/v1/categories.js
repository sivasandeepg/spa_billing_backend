// src/routes/v1/categories.js

import express from 'express';
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from '../../controllers/categoryController.js';

import { authenticateToken, authorize } from '../../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(authenticateToken, authorize(['admin', 'manager', 'pos']), getCategories)
  .post(authenticateToken, authorize(['admin']), addCategory);

router.route('/:id')
  .put(authenticateToken, authorize(['admin']), updateCategory)
  .delete(authenticateToken, authorize(['admin']), deleteCategory);

export default router; 
     