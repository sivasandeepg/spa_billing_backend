// src/routes/v1/customer.js

import express from 'express';
import {
    verifyCustomerByPhone,
    addOrUpdateCustomer,
    getCustomerMemberships,
    validateMembershipForTransaction,
    searchCustomers
} from '../../controllers/customerController.js';
import { authenticateToken, authorize } from '../../middleware/auth.js';

const router = express.Router();

// Phone verification endpoint - check if customer exists by phone
router.get('/verify-phone/:phone', 
    authenticateToken, 
    authorize(['pos', 'manager', 'admin']), 
    verifyCustomerByPhone
);

// Add or update customer
router.post('/', 
    authenticateToken, 
    authorize(['pos', 'manager', 'admin']), 
    addOrUpdateCustomer
);

// Search customers by phone or name
router.get('/search', 
    authenticateToken, 
    authorize(['pos', 'manager', 'admin']), 
    searchCustomers
);

// Get customer memberships
router.get('/:customerId/memberships', 
    authenticateToken, 
    authorize(['pos', 'manager', 'admin']), 
    getCustomerMemberships
);

// Validate membership for transaction
router.post('/validate-membership', 
    authenticateToken, 
    authorize(['pos', 'manager', 'admin']), 
    validateMembershipForTransaction
);

export default router;   