// src/routes/v1/membership.js
import express from 'express';
import {
    getMembershipsController,
    addMembershipController,
    getMembershipByCodeController,
    updateMembershipController,
    deleteMembershipController,
    getMembershipStatsController
} from '../../controllers/membershipController.js';
import { authenticateToken, authorize } from '../../middleware/auth.js';

const router = express.Router();

// Get all memberships and create new membership
router.route('/')
    .get(authenticateToken, authorize(['admin', 'manager', 'pos']), getMembershipsController)
    .post(authenticateToken, authorize(['admin', 'manager']), addMembershipController);

// Get membership statistics
router.route('/stats')
    .get(authenticateToken, authorize(['admin', 'manager']), getMembershipStatsController);

// Get membership by code (for POS lookup)
router.route('/code/:code')
    .get(authenticateToken, authorize(['pos', 'manager', 'admin']), getMembershipByCodeController);

// Update and delete membership by ID
router.route('/:id')
    .put(authenticateToken, authorize(['admin', 'manager']), updateMembershipController)
    .delete(authenticateToken, authorize(['admin']), deleteMembershipController);

export default router;   