// Create src/services/commissionService.js
import prisma from '../config/database.js';

export const calculateEmployeeCommissions = async (transactionId) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: {
      items: {
        include: { employee: true }
      }
    }
  });

  const commissions = [];
  
  for (const item of transaction.items) {
    if (item.employee) {
      const commissionAmount = (item.price * item.quantity * item.employee.commission) / 100;
      commissions.push({
        employeeId: item.employee.id,
        employeeName: item.employee.name,
        serviceAmount: item.price * item.quantity,
        commissionRate: item.employee.commission,
        commissionAmount
      });
    }
  }
  
  return commissions;
};  