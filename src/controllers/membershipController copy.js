// src/controllers/membershipController.js

import prisma from '../config/database.js';

export const getMembershipsController = async (req, res, next) => {
    try {
        const memberships = await prisma.membership.findMany({
            include: { customer: true }
        });
        res.status(200).json({ status: 'success', data: { memberships } });
    } catch (error) {
        next(error);
    }
};

export const addMembershipController = async (req, res, next) => {
    try {
        const newMembership = await prisma.membership.create({ data: req.body });
        res.status(201).json({ status: 'success', data: { membership: newMembership } });
    } catch (error) {
        next(error);
    }
};

export const getMembershipByCodeController = async (req, res, next) => {
    try {
        const { code } = req.params;
        const membership = await prisma.membership.findUnique({
            where: { membershipCode: code },
            include: { customer: true }
        });
        if (!membership) {
            return res.status(404).json({ error: 'Membership not found' });
        }
        res.status(200).json({ status: 'success', data: { membership } });
    } catch (error) {
        next(error);
    }
};

export const updateMembershipController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedMembership = await prisma.membership.update({ where: { id }, data: req.body });
        res.status(200).json({ status: 'success', data: { membership: updatedMembership } });
    } catch (error) {
        next(error);
    }
};

export const deleteMembershipController = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma.membership.delete({ where: { id } });
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};  