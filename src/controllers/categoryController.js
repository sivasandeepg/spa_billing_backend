// src/controllers/categoryController.js

import prisma from '../config/database.js';

export const getCategories = async (req, res, next) => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json({ status: 'success', data: { categories } });
    } catch (error) {
        next(error);
    }
};

export const addCategory = async (req, res, next) => {
    try {
        const newCategory = await prisma.category.create({ data: req.body });
        res.status(201).json({ status: 'success', data: { category: newCategory } });
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedCategory = await prisma.category.update({ where: { id }, data: req.body });
        res.status(200).json({ status: 'success', data: { category: updatedCategory } });
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma.category.delete({ where: { id } });
        res.status(204).end();
    } catch (error) {
        next(error);
    }
}; 