// src/routes/v1/employee.js

import express from 'express';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../../controllers/employeeController.js';
import { authenticateToken, authorize } from '../../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(authenticateToken, authorize(['pos', 'admin', 'manager']), getEmployees)
    .post(authenticateToken, authorize(['pos', 'admin', 'manager']), addEmployee);

router.route('/:id')
    .put(authenticateToken, authorize(['pos', 'admin', 'manager']), updateEmployee)
    .delete(authenticateToken, authorize(['pos', 'admin', 'manager']), deleteEmployee);

export default router;     

  