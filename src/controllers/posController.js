import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/response.js';  

const prisma = new PrismaClient();
 
// Function to handle adding a new customer
export const addCustomer = async (req, res) => {
  const { name, phone, email, referralSource, referralDetails } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone number are required.' });
  }
  try {
    const newCustomer = await prisma.customer.create({
      data: { name, phone, email, referralSource, referralDetails },
    });
    res.status(201).json({ data: { customer: newCustomer, message: 'Customer added successfully.' } });
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target.includes('phone')) {
      return res.status(409).json({ error: 'A customer with this phone number already exists.' });
    }
    res.status(500).json({ error: 'Failed to add customer.' });
  }
};

    
export const getTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { customer: true, items: true },
      orderBy: { timestamp: 'desc' },
    });
    res.status(200).json({ data: { transactions, message: 'Transactions retrieved successfully.' } });
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ error: 'Failed to retrieve transactions.' });
  }
};
  
// Fix in posController.js
export const getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: { memberships: true },
    });
    res.status(200).json(successResponse(
      { customers }, 
      'Customers retrieved successfully.'
    ));
  } catch (error) {
    console.error('Error getting customers:', error);
    res.status(500).json(errorResponse('Failed to retrieve customers.'));
  }
}; 
 
// In posController.js - addTransaction function
export const addTransaction = async (req, res) => {
  const { branchId, subtotal, discount, tipAmount, total, paymentMethod, customerId, items } = req.body;
  
  if (!branchId || !items || !total) {
    return res.status(400).json({ error: 'Required transaction data is missing.' });
  }

  try {
    // Generate unique invoice number
    const timestamp = Date.now();
    const invoiceNumber = `INV-${branchId.slice(-4)}-${timestamp}`;
    
    const newTransaction = await prisma.transaction.create({
      data: {
        invoiceNumber,
        subtotal: subtotal || 0,
        discount: discount || 0,
        tipAmount: tipAmount || 0,
        total,
        cashierId: req.user.id, // Use authenticated user ID
        paymentMethod,
        branchId,
        customerId: customerId || null,
        items: {
          create: items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            itemType: item.itemType,
            employeeId: item.employeeId || null,
            serviceId: item.serviceId || null,
            comboId: item.comboId || null,
          })),
        },
      },
      include: { customer: true, items: true },
    });
    
    res.status(201).json({ 
      status: 'success', 
      data: { transaction: newTransaction } 
    });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to complete transaction.' 
    });
  }
};

 