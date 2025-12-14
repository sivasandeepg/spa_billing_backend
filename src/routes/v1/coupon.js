// src/routes/v1/coupon.js

import express from 'express';
import { getCoupons, addCoupon, getCouponByCodeController, updateCoupon, deleteCoupon } from '../../controllers/couponController.js';
import { authenticateToken, authorize } from '../../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(authenticateToken, authorize(['admin', 'manager']), getCoupons)
    .post(authenticateToken, authorize(['admin', 'manager']), addCoupon);

router.route('/code/:code')
    .get(authenticateToken, authorize(['pos', 'manager', 'admin']), getCouponByCodeController);

router.route('/:id')
    .put(authenticateToken, authorize(['admin', 'manager']), updateCoupon)
    .delete(authenticateToken, authorize(['admin']), deleteCoupon);

export default router; 

   