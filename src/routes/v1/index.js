// src/routes/v1/index.js

import { Router } from 'express';
import authRoutes from './auth.js';
import branchRoutes from './branches.js';
import categoryRoutes from './categories.js';
import serviceRoutes from './services.js'; 
import pos from './pos.js'; 
import customers from './customer.js'; 
import employeeRoutes from './employee.js';
import membershipRoutes from './membership.js';
import comboRoutes from './combo.js';
import couponRoutes from './coupon.js';
     
const router = Router();

router.use('/auth', authRoutes);
router.use('/branches', branchRoutes);
router.use('/categories', categoryRoutes);
router.use('/services', serviceRoutes);  
router.use('/pos', pos);  
router.use('/employees', employeeRoutes);
router.use('/memberships', membershipRoutes);
router.use('/combos', comboRoutes);
router.use('/coupons', couponRoutes); 
router.use('/customers', customers);  
export default router; 
 
   

