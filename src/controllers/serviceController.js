// src/controllers/serviceController.js

import prisma from '../config/database.js';
import { successResponse } from '../utils/response.js';
 
export const getServices = async (req, res, next) => {
  try {
    const { branchId } = req.query;
    
    let whereClause = {};
    if (branchId) {
      whereClause.branchIds = {
        has: branchId // PostgreSQL array contains operation
      };
    }
    
    const services = await prisma.service.findMany({
      where: whereClause,
      include: { category: true }
    });
    
    res.status(200).json(successResponse({ services }));
  } catch (error) {
    next(error);
  }
};  

export const addService = async (req, res, next) => {
    try {
        const newService = await prisma.service.create({ data: req.body });
        res.status(201).json({ status: 'success', data: { service: newService } });
    } catch (error) {
        next(error);
    }
};

export const updateService = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedService = await prisma.service.update({ where: { id }, data: req.body });
        res.status(200).json({ status: 'success', data: { service: updatedService } });
    } catch (error) {
        next(error);
    }
};

export const deleteService = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma.service.delete({ where: { id } });
        res.status(204).end();
    } catch (error) {
        next(error);
    }
}; 