// src/routes/v1/branch.js

import express from 'express';
import { getBranches, addBranch, updateBranch, deleteBranch } from '../../controllers/branchController.js';
import { authenticateToken, authorize } from '../../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(authenticateToken, authorize(['admin', 'manager', 'pos']), getBranches)
  .post(authenticateToken, authorize(['admin']), addBranch);

router.route('/:id')
  .put(authenticateToken, authorize(['admin']), updateBranch)
  .delete(authenticateToken, authorize(['admin']), deleteBranch);

export default router;  

    