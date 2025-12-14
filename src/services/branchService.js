// src/services/branchService.js

import prisma from '../config/database.js';

export const getAllBranches = async () => {
  return prisma.branch.findMany();
};

export const createBranch = async (branchData) => {
  return prisma.branch.create({
    data: branchData,
  });
};

export const updateBranchById = async (id, updates) => {
  return prisma.branch.update({
    where: { id },
    data: updates,
  });
};

export const deleteBranchById = async (id) => {
  return prisma.branch.delete({
    where: { id },
  });
};  