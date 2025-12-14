// Add to membershipService.js
export const validateMembership = async (membershipCode) => {
  const membership = await prisma.membership.findUnique({
    where: { membershipCode },
    include: { customer: true }
  });
  
  if (!membership) {
    return { valid: false, message: 'Membership not found' };
  }
  
  const now = new Date();
  if (now > membership.endDate) {
    return { valid: false, message: 'Membership expired' };
  }
  
  if (membership.status !== 'ACTIVE') {
    return { valid: false, message: 'Membership inactive' };
  }
  
  return { 
    valid: true, 
    membership,
    daysRemaining: Math.ceil((membership.endDate - now) / (1000 * 60 * 60 * 24))
  };
};  