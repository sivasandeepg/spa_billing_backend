// src/controllers/couponController.js

import prisma from '../config/database.js';

export const getCoupons = async (req, res, next) => {
    try {
        const coupons = await prisma.coupon.findMany();
        res.status(200).json({ status: 'success', data: { coupons } });
    } catch (error) {
        next(error);
    }
};

export const addCoupon = async (req, res, next) => {
    try {
        const newCoupon = await prisma.coupon.create({ data: req.body });
        res.status(201).json({ status: 'success', data: { coupon: newCoupon } });
    } catch (error) {
        next(error);
    }
};

export const getCouponByCodeController = async (req, res, next) => {
    try {
        const { code } = req.params;
        const coupon = await prisma.coupon.findUnique({ where: { code } });
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }
        res.status(200).json({ status: 'success', data: { coupon } });
    } catch (error) {
        next(error);
    }
};

export const updateCoupon = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedCoupon = await prisma.coupon.update({ where: { id }, data: req.body });
        res.status(200).json({ status: 'success', data: { coupon: updatedCoupon } });
    } catch (error) {
        next(error);
    }
};

export const deleteCoupon = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma.coupon.delete({ where: { id } });
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};  

// Add to couponController.js
export const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    
    if (!coupon) {
      return res.status(404).json({ status: 'error', message: 'Coupon not found' });
    }
    
    // Validate coupon
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return res.status(400).json({ status: 'error', message: 'Coupon expired' });
    }
    
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ status: 'error', message: 'Coupon usage limit exceeded' });
    }
    
    // Increment usage count
    await prisma.coupon.update({
      where: { id: coupon.id },
      data: { usageCount: coupon.usageCount + 1 }
    });
    
    res.status(200).json({ 
      status: 'success', 
      data: { coupon, discount: coupon.discount } 
    });
  } catch (error) {
    next(error);
  }
};  