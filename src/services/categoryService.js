// src/services/categoryService.js

import prisma from '../config/database.js';

export const getAllCategories = async () => {
  return prisma.category.findMany();
};

export const createCategory = async (categoryData) => {
  return prisma.category.create({
    data: categoryData,
  });
};

export const updateCategoryById = async (id, updates) => {
  return prisma.category.update({
    where: { id },
    data: updates,
  });
};

export const deleteCategoryById = async (id) => {
  return prisma.category.delete({
    where: { id },
  });
};  