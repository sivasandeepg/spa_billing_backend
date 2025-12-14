// src/controllers/comboController.js

import prisma from '../config/database.js';

export const getCombos = async (req, res, next) => {
    try {
        const { user } = req;
        let whereClause = {};

        // Filter by branch for non-admin users
        if (user.role === 'manager' && user.branchId) {
            whereClause.branchId = user.branchId;
        } else if (user.role === 'pos' && user.branchId) {
            whereClause.branchId = user.branchId;
        }

        const combos = await prisma.combo.findMany({
            where: whereClause,
            include: { 
                services: { 
                    include: { 
                        service: {
                            include: {
                                category: true
                            }
                        }
                    } 
                },
                branch: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        res.status(200).json({ status: 'success', data: { combos } });
    } catch (error) {
        next(error);
    }
};

export const getComboById = async (req, res, next) => {
    try {
        const { user } = req;
        const { id } = req.params;
        
        let whereClause = { id };
        
        // Filter by branch for non-admin users
        if (user.role !== 'admin' && user.branchId) {
            whereClause.branchId = user.branchId;
        }

        const combo = await prisma.combo.findUnique({
            where: whereClause,
            include: { 
                services: { 
                    include: { 
                        service: {
                            include: {
                                category: true
                            }
                        }
                    } 
                },
                branch: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        if (!combo) {
            return res.status(404).json({ error: 'Combo not found' });
        }
        
        res.status(200).json({ status: 'success', data: { combo } });
    } catch (error) {
        next(error);
    }
};

export const addCombo = async (req, res, next) => {
    try {
        const { user } = req;
        const { services, ...comboData } = req.body;
        
        // Validate required fields
        if (!comboData.name || !comboData.totalPrice || !comboData.discountPrice) {
            return res.status(400).json({ error: 'Name, totalPrice, and discountPrice are required' });
        }

        if (!services || services.length === 0) {
            return res.status(400).json({ error: 'At least one service is required' });
        }

        // Automatically assign branchId for non-admin users
        const finalComboData = {
            ...comboData,
            branchId: user.role === 'admin' ? comboData.branchId : user.branchId,
            // Calculate discount percentage if not provided
            discountPercentage: comboData.discountPercentage || 
                Math.round(((comboData.totalPrice - comboData.discountPrice) / comboData.totalPrice) * 100 * 100) / 100
        };

        // Verify that all services exist and are available for the branch
        const serviceIds = services.map(s => s.serviceId);
        const existingServices = await prisma.service.findMany({
            where: {
                id: { in: serviceIds },
                status: 'ACTIVE',
                branchIds: { has: finalComboData.branchId }
            }
        });

        // if (existingServices.length !== serviceIds.length) {
        //     return res.status(400).json({ error: 'One or more services are invalid or not available for this branch' });
        // }
 
        const newCombo = await prisma.combo.create({
            data: {
                ...finalComboData,
                services: {
                    create: services.map(s => ({ 
                        serviceId: s.serviceId, 
                        quantity: s.quantity || 1 
                    }))
                }
            },
            include: {
                services: {
                    include: {
                        service: {
                            include: {
                                category: true
                            }
                        }
                    }
                },
                branch: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        
        res.status(201).json({ status: 'success', data: { combo: newCombo } });
    } catch (error) {
        // Handle unique constraint error
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'A combo with this name already exists in this branch.' });
        }
        next(error);
    }
};

export const updateCombo = async (req, res, next) => {
    try {
        const { user } = req;
        const { id } = req.params;
        const { services, ...comboData } = req.body;
        
        // Check if combo exists and user has permission to update it
        const existingCombo = await prisma.combo.findUnique({
            where: { id },
            include: {
                services: true
            }
        });
        
        if (!existingCombo) {
            return res.status(404).json({ error: 'Combo not found' });
        }
        
        // Non-admin users can only update combos from their branch
        if (user.role !== 'admin' && existingCombo.branchId !== user.branchId) {
            return res.status(403).json({ error: 'You can only update combos from your branch' });
        }

        // If services are provided, verify they exist and are available
        if (services && services.length > 0) {
            const serviceIds = services.map(s => s.serviceId);
            const existingServices = await prisma.service.findMany({
                where: {
                    id: { in: serviceIds },
                    status: 'ACTIVE',
                    branchIds: { has: existingCombo.branchId }
                }
            });

            // if (existingServices.length !== serviceIds.length) {
            //     return res.status(400).json({ error: 'One or more services are invalid or not available for this branch' });
            // }
        }

        // Calculate discount percentage if prices are updated
        const updateData = { ...comboData };
        if (updateData.totalPrice && updateData.discountPrice) {
            updateData.discountPercentage = Math.round(((updateData.totalPrice - updateData.discountPrice) / updateData.totalPrice) * 100 * 100) / 100;
        }

        const updatedCombo = await prisma.combo.update({
            where: { id },
            data: {
                ...updateData,
                ...(services && {
                    services: {
                        deleteMany: {},
                        create: services.map(s => ({ 
                            serviceId: s.serviceId, 
                            quantity: s.quantity || 1 
                        }))
                    }
                })
            },
            include: {
                services: {
                    include: {
                        service: {
                            include: {
                                category: true
                            }
                        }
                    }
                },
                branch: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        
        res.status(200).json({ status: 'success', data: { combo: updatedCombo } });
    } catch (error) {
        // Handle unique constraint error
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'A combo with this name already exists in this branch.' });
        }
        next(error);
    }
};

export const deleteCombo = async (req, res, next) => {
    try {
        const { user } = req;
        const { id } = req.params;
        
        // Check if combo exists and user has permission to delete it
        const existingCombo = await prisma.combo.findUnique({
            where: { id }
        });
        
        if (!existingCombo) {
            return res.status(404).json({ error: 'Combo not found' });
        }
        
        // Non-admin users can only delete combos from their branch
        if (user.role !== 'admin' && existingCombo.branchId !== user.branchId) {
            return res.status(403).json({ error: 'You can only delete combos from your branch' });
        }

        // Check if combo is used in any transactions
        const transactionItems = await prisma.transactionItem.findMany({
            where: { comboId: id }
        });

        if (transactionItems.length > 0) {
            return res.status(400).json({ 
                error: 'Cannot delete combo that has been used in transactions. Consider marking it as inactive instead.' 
            });
        }

        // Delete combo services first (handled by Cascade), then the combo
        await prisma.combo.delete({ where: { id } });
        
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

export const updateComboStatus = async (req, res, next) => {
    try {
        const { user } = req;
        const { id } = req.params;
        const { status } = req.body;
        
        if (!['ACTIVE', 'INACTIVE', 'EXPIRED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Must be ACTIVE, INACTIVE, or EXPIRED' });
        }
        
        // Check if combo exists and user has permission to update it
        const existingCombo = await prisma.combo.findUnique({
            where: { id }
        });
        
        if (!existingCombo) {
            return res.status(404).json({ error: 'Combo not found' });
        }
        
        // Non-admin users can only update combos from their branch
        if (user.role !== 'admin' && existingCombo.branchId !== user.branchId) {
            return res.status(403).json({ error: 'You can only update combos from your branch' });
        }

        const updatedCombo = await prisma.combo.update({
            where: { id },
            data: { status },
            include: {
                services: {
                    include: {
                        service: {
                            include: {
                                category: true
                            }
                        }
                    }
                },
                branch: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        
        res.status(200).json({ status: 'success', data: { combo: updatedCombo } });
    } catch (error) {
        next(error);
    }
}; 