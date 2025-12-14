// src/controllers/comboController.js

import prisma from '../config/database.js';

export const getCombos = async (req, res, next) => {
    try {
        const combos = await prisma.combo.findMany({
            include: { services: { include: { service: true } } }
        });
        res.status(200).json({ status: 'success', data: { combos } });
    } catch (error) {
        next(error);
    }
};

export const addCombo = async (req, res, next) => {
    const { services, ...comboData } = req.body;
    try {
        const newCombo = await prisma.combo.create({
            data: {
                ...comboData,
                services: {
                    create: services.map(s => ({ serviceId: s.serviceId, quantity: s.quantity }))
                }
            }
        });
        res.status(201).json({ status: 'success', data: { combo: newCombo } });
    } catch (error) {
        next(error);
    }
};

export const updateCombo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { services, ...comboData } = req.body;
        const updatedCombo = await prisma.combo.update({
            where: { id },
            data: {
                ...comboData,
                services: {
                    deleteMany: {},
                    create: services.map(s => ({ serviceId: s.serviceId, quantity: s.quantity }))
                }
            }
        });
        res.status(200).json({ status: 'success', data: { combo: updatedCombo } });
    } catch (error) {
        next(error);
    }
};

export const deleteCombo = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma.comboService.deleteMany({ where: { comboId: id } });
        await prisma.combo.delete({ where: { id } });
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};  