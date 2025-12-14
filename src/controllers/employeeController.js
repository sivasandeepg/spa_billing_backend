// src/controllers/employeeController.js

import prisma from '../config/database.js';

export const getEmployees = async (req, res, next) => {
    try {
        const { user } = req;
        let whereClause = {};

        // Only allow admins to see all employees
        if (user.role === 'manager' && user.branchId) {
            whereClause.branchId = user.branchId;
        }

        const employees = await prisma.employee.findMany({
            where: whereClause,
            include: { branch: true }
        });
        
        res.status(200).json({ status: 'success', data: { employees } });
    } catch (error) {
        next(error);
    }
};

export const addEmployee = async (req, res, next) => {
    try {
        const { user } = req;
        
        // Destructure and map fields properly
        const { position, ...otherFields } = req.body;
        
        const newEmployeeData = {
            ...otherFields,
            designation: position || otherFields.designation, // Map position to designation
            employeeCode: `EMP-${user.branchId.slice(0, 4)}-${Math.floor(Math.random() * 10000)}`,
            branchId: user.branchId
        };

        const newEmployee = await prisma.employee.create({ data: newEmployeeData });
        res.status(201).json({ status: 'success', data: { employee: newEmployee } });
    } catch (error) {
        // Handle unique constraint error
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Employee code or phone number already exists.' });
        }
        next(error);
    }
};
 
export const updateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Map position to designation if it exists
        const { position, ...otherFields } = req.body;
        const updateData = {
            ...otherFields,
            ...(position && { designation: position })
        };
        
        const updatedEmployee = await prisma.employee.update({ 
            where: { id }, 
            data: updateData 
        });
        res.status(200).json({ status: 'success', data: { employee: updatedEmployee } });
    } catch (error) {
        next(error);
    }
};
   
export const deleteEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma.employee.delete({ where: { id } });
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};  