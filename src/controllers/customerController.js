// src/controllers/customerController.js

import prisma from '../config/database.js';

export const verifyCustomerByPhone = async (req, res, next) => {
    try {
        const { phone } = req.params;
        
        // Validate phone number format (basic validation)
        if (!phone || phone.length < 10) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid phone number format'
            });
        }

        // Check if customer exists
        const existingCustomer = await prisma.customer.findUnique({
            where: { phone },
            include: {
                memberships: {
                    where: { 
                        status: 'ACTIVE',
                        endDate: {
                            gte: new Date() // Only active non-expired memberships
                        }
                    },
                    select: {
                        id: true,
                        membershipCode: true,
                        type: true,
                        discountPercentage: true,
                        endDate: true,
                        benefits: true
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

        if (existingCustomer) {
            // Customer exists - return customer data with membership info
            return res.status(200).json({
                status: 'success',
                data: {
                    isExisting: true,
                    customer: {
                        id: existingCustomer.id,
                        customerCode: existingCustomer.customerCode,
                        name: existingCustomer.name,
                        phone: existingCustomer.phone,
                        email: existingCustomer.email,
                        dateOfBirth: existingCustomer.dateOfBirth,
                        gender: existingCustomer.gender,
                        address: existingCustomer.address,
                        totalSpent: existingCustomer.totalSpent,
                        visitCount: existingCustomer.visitCount,
                        lastVisit: existingCustomer.lastVisit,
                        referralSource: existingCustomer.referralSource,
                        referredByEmployee: existingCustomer.referredByEmployee
                    },
                    memberships: existingCustomer.memberships,
                    hasActiveMembership: existingCustomer.memberships.length > 0
                }
            });
        } else {
            // Customer doesn't exist - new customer
            return res.status(200).json({
                status: 'success',
                data: {
                    isExisting: false,
                    customer: null,
                    memberships: [],
                    hasActiveMembership: false
                }
            });
        }

    } catch (error) {
        console.error('Error verifying customer by phone:', error);
        next(error);
    }
};

export const addOrUpdateCustomer = async (req, res, next) => {
    try {
        const {
            phone,
            name,
            email,
            dateOfBirth,
            gender,
            address,
            referralSource,
            referralDetails,
            referredByEmployeeId,
            isExisting,
            customerId
        } = req.body;

        // Validate required fields
        if (!phone || !name) {
            return res.status(400).json({
                status: 'error',
                message: 'Phone number and name are required'
            });
        }

        // Validate employee if provided
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

        let customer;

        if (isExisting && customerId) {
            // Update existing customer
            customer = await prisma.customer.update({
                where: { id: customerId },
                data: {
                    visitCount: {
                        increment: 1
                    },
                    lastVisit: new Date(),
                    ...(referredByEmployeeId && { referredByEmployeeId })
                },
                include: {
                    memberships: {
                        where: { 
                            status: 'ACTIVE',
                            endDate: { gte: new Date() }
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
        } else {
            // Create new customer
            const customerCode = `CUST${Date.now().toString().slice(-6)}`;
            
            customer = await prisma.customer.create({
                data: {
                    customerCode,
                    name,
                    phone,
                    email: email || null,
                    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                    gender: gender || null,
                    address: address || null,
                    referralSource: referralSource || 'WALK_IN',
                    referralDetails: referralDetails || null,
                    referredByEmployeeId: referredByEmployeeId || null,
                    visitCount: 1,
                    lastVisit: new Date(),
                    totalSpent: 0.0
                },
                include: {
                    memberships: true,
                    referredByEmployee: {
                        select: {
                            id: true,
                            name: true,
                            designation: true
                        }
                    }
                }
            });
        }

        res.status(isExisting ? 200 : 201).json({
            status: 'success',
            data: { 
                customer,
                isExisting,
                message: isExisting ? 'Customer updated successfully' : 'Customer created successfully'
            }
        });

    } catch (error) {
        if (error.code === 'P2002' && error.meta?.target?.includes('phone')) {
            return res.status(409).json({
                status: 'error',
                message: 'A customer with this phone number already exists'
            });
        }
        console.error('Error adding/updating customer:', error);
        next(error);
    }
};

export const getCustomerMemberships = async (req, res, next) => {
    try {
        const { customerId } = req.params;

        const memberships = await prisma.membership.findMany({
            where: { 
                customerId,
                status: 'ACTIVE',
                endDate: { gte: new Date() }
            },
            include: {
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
            data: { memberships }
        });

    } catch (error) {
        console.error('Error getting customer memberships:', error);
        next(error);
    }
};

export const validateMembershipForTransaction = async (req, res, next) => {
    try {
        const { membershipId, serviceIds } = req.body;

        if (!membershipId || !serviceIds || !Array.isArray(serviceIds)) {
            return res.status(400).json({
                status: 'error',
                message: 'Membership ID and service IDs are required'
            });
        }

        const membership = await prisma.membership.findUnique({
            where: { id: membershipId },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        phone: true
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

        // Check if membership is active and not expired
        const isValid = membership.status === 'ACTIVE' && new Date(membership.endDate) >= new Date();

        if (!isValid) {
            return res.status(400).json({
                status: 'error',
                message: 'Membership is expired or inactive'
            });
        }

        // Get service details
        const services = await prisma.service.findMany({
            where: {
                id: { in: serviceIds }
            }
        });

        // Calculate discount based on membership
        const totalOriginalPrice = services.reduce((sum, service) => sum + service.price, 0);
        const discountAmount = (totalOriginalPrice * membership.discountPercentage) / 100;
        const finalPrice = totalOriginalPrice - discountAmount;

        res.status(200).json({
            status: 'success',
            data: {
                membership: {
                    id: membership.id,
                    code: membership.membershipCode,
                    type: membership.type,
                    discountPercentage: membership.discountPercentage,
                    benefits: membership.benefits
                },
                customer: membership.customer,
                services,
                pricing: {
                    originalPrice: totalOriginalPrice,
                    discountAmount,
                    finalPrice,
                    discountPercentage: membership.discountPercentage
                },
                isValid: true
            }
        });

    } catch (error) {
        console.error('Error validating membership:', error);
        next(error);
    }
};

export const searchCustomers = async (req, res, next) => {
    try {
        const { phone, name } = req.query;
        
        if (!phone && !name) {
            return res.status(400).json({
                status: 'error',
                message: 'Phone or name parameter is required'
            });
        }

        let whereClause = {};
        
        if (phone) {
            whereClause.phone = { contains: phone };
        }
        
        if (name) {
            whereClause.name = { contains: name, mode: 'insensitive' };
        }

        const customers = await prisma.customer.findMany({
            where: whereClause,
            include: {
                memberships: {
                    where: { 
                        status: 'ACTIVE',
                        endDate: { gte: new Date() }
                    }
                }
            },
            take: 10 // Limit results
        });

        res.status(200).json({
            status: 'success',
            data: { customers }
        });

    } catch (error) {
        console.error('Error searching customers:', error);
        next(error);
    }
};  