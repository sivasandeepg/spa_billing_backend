// src/routes/v1/service.js

import express from 'express';
import { getServices, addService, updateService, deleteService } from '../../controllers/serviceController.js';
import { authenticateToken, authorize } from '../../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(authenticateToken, authorize(['admin', 'manager', 'pos']), getServices)
    .post(authenticateToken, authorize(['admin', 'manager']), addService);

router.route('/:id')
    .put(authenticateToken, authorize(['admin', 'manager']), updateService)
    .delete(authenticateToken, authorize(['admin', 'manager']), deleteService);

export default router; 

    