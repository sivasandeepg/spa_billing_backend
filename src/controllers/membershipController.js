// src/controllers/membershipController.js
import prisma from '../config/database.js';

export const getMembershipsController = async (req, res, next) => {
    try {
        const memberships = await prisma.membership.findMany({
            include: {
                customer: {
                    select: {
                        id: true,
                        customerCode: true,
                        name: true,
                        phone: true,
                        email: true
                    }
                },
                referredByEmployee: {
                    select: {
                        id: true,
                        name: true,
                        designation: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({ 
            status: 'success', 
            data: { memberships } 
        });
    } catch (error) {
        next(error);
    }
};

export const addMembershipController = async (req, res, next) => {
    try {
        const {
            membershipCode,
            customerId,
            type,
            price,
            discountPercentage,
            startDate,
            endDate,
            status,
            referredByEmployeeId,
            benefits
        } = req.body;

        // Generate membership code if not provided
        const finalMembershipCode = membershipCode || `MEM${Date.now().toString().slice(-6)}`;

        // Validate required fields
        if (!customerId || !type || !price || !discountPercentage || !startDate || !endDate) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields: customerId, type, price, discountPercentage, startDate, endDate'
            });
        }
        console.log('customerId')
        console.log(customerId)
         console.log('customerId')
         
        // Check if customer exists
        const customer = await prisma.customer.findUnique({
            where: { id: customerId }
        });

        if (!customer) {
            return res.status(404).json({
                status: 'error',
                message: 'Customer not found'
            });
        }

        // Check if employee exists (if referredByEmployeeId is provided)
        if (referredByEmployeeId) {
            const employee = await prisma.employee.findUnique({
                where: { id: referredByEmployeeId }
            });

            if (!employee) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Referred employee not found'
                });
            }
        }

        // Check for existing membership code
        const existingMembership = await prisma.membership.findUnique({
            where: { membershipCode: finalMembershipCode }
        });

        if (existingMembership) {
            return res.status(400).json({
                status: 'error',
                message: 'Membership code already exists'
            });
        }

        const membershipData = {
            membershipCode: finalMembershipCode,
            customerId,
            type,
            price: parseFloat(price),
            discountPercentage: parseFloat(discountPercentage),
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status: status || 'ACTIVE',
            benefits: benefits || {
                freeServices: true,
                priorityBooking: true,
                specialOffers: true
            }
        };

        // Add referredByEmployeeId if provided
        if (referredByEmployeeId) {
            membershipData.referredByEmployeeId = referredByEmployeeId;
        }

        const newMembership = await prisma.membership.create({
            data: membershipData,
            include: {
                customer: {
                    select: {
                        id: true,
                        customerCode: true,
                        name: true,
                        phone: true,
                        email: true
                    }
                },
                referredByEmployee: {
                    select: {
                        id: true,
                        name: true,
                        designation: true
                    }
                }
            }
        });

        res.status(201).json({ 
            status: 'success', 
            data: { membership: newMembership } 
        });
    } catch (error) {
        next(error);
    }
};

export const getMembershipByCodeController = async (req, res, next) => {
    try {
        const { code } = req.params;
        
        const membership = await prisma.membership.findUnique({
            where: { membershipCode: code },
            include: {
                customer: {
                    select: {
                        id: true,
                        customerCode: true,
                        name: true,
                        phone: true,
                        email: true
                    }
                },
                referredByEmployee: {
                    select: {
                        id: true,
                        name: true,
                        designation: true
                    }
                }
            }
        });

        if (!membership) {
            return res.status(404).json({ 
                status: 'error',
                message: 'Membership not found' 
            });
        }

        res.status(200).json({ 
            status: 'success', 
            data: { membership } 
        });
    } catch (error) {
        next(error);
    }
};

export const updateMembershipController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            membershipCode,
            customerId,
            type,
            price,
            discountPercentage,
            startDate,
            endDate,
            status,
            referredByEmployeeId,
            benefits
        } = req.body;

        // Check if membership exists
        const existingMembership = await prisma.membership.findUnique({
            where: { id }
        });

        if (!existingMembership) {
            return res.status(404).json({
                status: 'error',
                message: 'Membership not found'
            });
        }

        // If membershipCode is being changed, check for conflicts
        if (membershipCode && membershipCode !== existingMembership.membershipCode) {
            const codeConflict = await prisma.membership.findUnique({
                where: { membershipCode }
            });

            if (codeConflict) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Membership code already exists'
                });
            }
        }

        // Check if customer exists (if being changed)
        if (customerId && customerId !== existingMembership.customerId) {
            const customer = await prisma.customer.findUnique({
                where: { id: customerId }
            });

            if (!customer) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Customer not found'
                });
            }
        }

        // Check if employee exists (if referredByEmployeeId is provided)
        if (referredByEmployeeId) {
            const employee = await prisma.employee.findUnique({
                where: { id: referredByEmployeeId }
            });

            if (!employee) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Referred employee not found'
                });
            }
        }

        const updateData = {};
        
        if (membershipCode) updateData.membershipCode = membershipCode;
        if (customerId) updateData.customerId = customerId;
        if (type) updateData.type = type;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (discountPercentage !== undefined) updateData.discountPercentage = parseFloat(discountPercentage);
        if (startDate) updateData.startDate = new Date(startDate);
        if (endDate) updateData.endDate = new Date(endDate);
        if (status) updateData.status = status;
        if (benefits) updateData.benefits = benefits;
        if (referredByEmployeeId !== undefined) {
            updateData.referredByEmployeeId = referredByEmployeeId || null;
        }

        const updatedMembership = await prisma.membership.update({
            where: { id },
            data: updateData,
            include: {
                customer: {
                    select: {
                        id: true,
                        customerCode: true,
                        name: true,
                        phone: true,
                        email: true
                    }
                },
                referredByEmployee: {
                    select: {
                        id: true,
                        name: true,
                        designation: true
                    }
                }
            }
        });

        res.status(200).json({ 
            status: 'success', 
            data: { membership: updatedMembership } 
        });
    } catch (error) {
        next(error);
    }
};

export const deleteMembershipController = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if membership exists
        const existingMembership = await prisma.membership.findUnique({
            where: { id }
        });

        if (!existingMembership) {
            return res.status(404).json({
                status: 'error',
                message: 'Membership not found'
            });
        }

        await prisma.membership.delete({ 
            where: { id } 
        });

        res.status(200).json({
            status: 'success',
            message: 'Membership deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Additional controller for getting membership statistics
export const getMembershipStatsController = async (req, res, next) => {
    try {
        const stats = await prisma.membership.groupBy({
            by: ['status', 'type'],
            _count: {
                id: true
            }
        });

        const totalMemberships = await prisma.membership.count();
        const activeMemberships = await prisma.membership.count({
            where: { status: 'ACTIVE' }
        });
        const expiredMemberships = await prisma.membership.count({
            where: { status: 'EXPIRED' }
        });

        const formattedStats = {
            total: totalMemberships,
            active: activeMemberships,
            expired: expiredMemberships,
            byType: {},
            byStatus: {}
        };

        stats.forEach(stat => {
            if (!formattedStats.byType[stat.type]) {
                formattedStats.byType[stat.type] = 0;
            }
            if (!formattedStats.byStatus[stat.status]) {
                formattedStats.byStatus[stat.status] = 0;
            }
            formattedStats.byType[stat.type] += stat._count.id;
            formattedStats.byStatus[stat.status] += stat._count.id;
        });

        res.status(200).json({
            status: 'success',
            data: { stats: formattedStats }
        });
    } catch (error) {
        next(error);
    }
};      