// src/controllers/branchController.js

import prisma from '../config/database.js';

export const getBranches = async (req, res, next) => {
    try {
        const branches = await prisma.branch.findMany({
            include: { users: true, employees: true },
        });
        res.status(200).json({ status: 'success', data: { branches } });
    } catch (error) {
        next(error);
    }
};

export const addBranch = async (req, res, next) => {
    try {
        const newBranch = await prisma.branch.create({ data: req.body });
        res.status(201).json({ status: 'success', data: { branch: newBranch } });
    } catch (error) {
        next(error);
    }
};

export const updateBranch = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedBranch = await prisma.branch.update({ where: { id }, data: req.body });
        res.status(200).json({ status: 'success', data: { branch: updatedBranch } });
    } catch (error) {
        next(error);
    }
};

export const deleteBranch = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma.branch.delete({ where: { id } });
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};   