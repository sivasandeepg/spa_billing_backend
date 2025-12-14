// src/services/serviceService.js

import prisma from '../config/database.js';

export const getAllServices = async () => {
  return prisma.service.findMany();
};

export const createService = async (serviceData) => {
  return prisma.service.create({
    data: serviceData,
  });
};

export const updateServiceById = async (id, updates) => {
  return prisma.service.update({
    where: { id },
    data: updates,
  });
};

export const deleteServiceById = async (id) => {
  return prisma.service.delete({
    where: { id },
  });
};  