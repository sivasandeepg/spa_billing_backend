// src/routes/v1/membership.js

import express from 'express';
import {
    getMembershipsController,
    addMembershipController,
    getMembershipByCodeController,
    updateMembershipController,
    deleteMembershipController,
} from '../../controllers/membershipController.js';
import { authenticateToken, authorize } from '../../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(authenticateToken, authorize(['admin', 'manager']), getMembershipsController)
    .post(authenticateToken, authorize(['admin', 'manager']), addMembershipController);

router.route('/code/:code')
    .get(authenticateToken, authorize(['pos', 'manager', 'admin']), getMembershipByCodeController);

router.route('/:id')
    .put(authenticateToken, authorize(['admin', 'manager']), updateMembershipController)
    .delete(authenticateToken, authorize(['admin']), deleteMembershipController);

export default router;

  