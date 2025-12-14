// prisma/seed.js

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clear existing data (in reverse order of dependencies)
  await prisma.couponUsage.deleteMany({});
  await prisma.transactionItem.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.comboService.deleteMany({});
  await prisma.combo.deleteMany({});
  await prisma.membership.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.branch.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.systemSetting.deleteMany({});

  console.log('Existing data cleared.');

  // 1. Create System Settings
  const systemSettings = await Promise.all([
    prisma.systemSetting.create({
      data: {
        key: 'business_name',
        value: 'Serenity Spa & Wellness',
        description: 'Main business name',
        category: 'business'
      }
    }),
    prisma.systemSetting.create({
      data: {
        key: 'tax_rate',
        value: '18.0',
        description: 'GST rate percentage',
        category: 'financial'
      }
    }),
    prisma.systemSetting.create({
      data: {
        key: 'default_currency',
        value: 'INR',
        description: 'Default currency code',
        category: 'business'
      }
    }),
    prisma.systemSetting.create({
      data: {
        key: 'invoice_prefix',
        value: 'SS',
        description: 'Invoice number prefix',
        category: 'business'
      }
    })
  ]);

  console.log(`Created ${systemSettings.length} system settings.`);

  // 2. Create Branches
  const branches = await Promise.all([
    prisma.branch.create({
      data: {
        name: 'Serenity Spa Main Branch',
        address: '123 Wellness Street, Downtown, Tirupati, AP 517501',
        phone: '+91 9876543210',
        email: 'main@serenityspa.com',
        manager: 'Priya Sharma',
        status: 'ACTIVE',
        operatingHours: {
          monday: { open: '09:00', close: '21:00' },
          tuesday: { open: '09:00', close: '21:00' },
          wednesday: { open: '09:00', close: '21:00' },
          thursday: { open: '09:00', close: '21:00' },
          friday: { open: '09:00', close: '22:00' },
          saturday: { open: '08:00', close: '22:00' },
          sunday: { open: '10:00', close: '20:00' }
        }
      }
    }),
    prisma.branch.create({
      data: {
        name: 'Serenity Spa City Center',
        address: '456 Relaxation Avenue, City Center, Tirupati, AP 517502',
        phone: '+91 9876543211',
        email: 'citycenter@serenityspa.com',
        manager: 'Arjun Reddy',
        status: 'ACTIVE',
        operatingHours: {
          monday: { open: '10:00', close: '20:00' },
          tuesday: { open: '10:00', close: '20:00' },
          wednesday: { open: '10:00', close: '20:00' },
          thursday: { open: '10:00', close: '20:00' },
          friday: { open: '10:00', close: '21:00' },
          saturday: { open: '09:00', close: '21:00' },
          sunday: { open: '11:00', close: '19:00' }
        }
      }
    })
  ]);

  console.log(`Created ${branches.length} branches.`);
      
  // 3. Create Users
  const saltRounds = 12;
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@serenityspa.com',
        password: await bcrypt.hash('admin123', saltRounds),
        role: 'admin',
        name: 'System administrator',
        status: 'ACTIVE',
        branchId: branches[0].id
      }
    }),
    prisma.user.create({
      data: {
        username: 'manager1',
        email: 'priya@serenityspa.com',
        password: await bcrypt.hash('manager123', saltRounds),
        role: 'manager',
        name: 'Priya Sharma',
        status: 'ACTIVE',
        branchId: branches[0].id
      }
    }),
    prisma.user.create({
      data: {
        username: 'manager2',
        email: 'arjun@serenityspa.com',
        password: await bcrypt.hash('manager123', saltRounds),
        role: 'manager',
        name: 'Arjun Reddy',
        status: 'ACTIVE',
        branchId: branches[1].id
      }
    }),
    prisma.user.create({
      data: {
        username: 'pos1',
        email: 'cashier1@serenityspa.com',
        password: await bcrypt.hash('pos123', saltRounds),
        role: 'pos',
        name: 'Meera Kumar',
        status: 'ACTIVE',
        branchId: branches[0].id
      }
    }),
    prisma.user.create({
      data: {
        username: 'pos2',
        email: 'cashier2@serenityspa.com',
        password: await bcrypt.hash('pos123', saltRounds),
        role: 'pos',
        name: 'Ravi Patel',
        status: 'ACTIVE',
        branchId: branches[1].id
      }
    })
  ]);

  console.log(`Created ${users.length} users.`);
   
  // 4. Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Body Massage',
        description: 'Relaxing and therapeutic body massage services',
        status: 'ACTIVE',
        sortOrder: 1
      }
    }),
    prisma.category.create({
      data: {
        name: 'Facial Treatments',
        description: 'Professional facial and skin care treatments',
        status: 'ACTIVE',
        sortOrder: 2
      }
    }),
    prisma.category.create({
      data: {
        name: 'Body Treatments',
        description: 'Specialized body care and wellness treatments',
        status: 'ACTIVE',
        sortOrder: 3
      }
    }),
    prisma.category.create({
      data: {
        name: 'Hair & Scalp',
        description: 'Hair and scalp care treatments',
        status: 'ACTIVE',
        sortOrder: 4
      }
    }),
    prisma.category.create({
      data: {
        name: 'Wellness Therapies',
        description: 'Holistic wellness and healing therapies',
        status: 'ACTIVE',
        sortOrder: 5
      }
    })
  ]);

  console.log(`Created ${categories.length} categories.`);

  // 5. Create Services
  const services = await Promise.all([
    // Body Massage Services
    prisma.service.create({
      data: {
        name: 'Swedish Full Body Massage',
        description: 'Relaxing full body massage with essential oils',
        price: 2500.00,
        duration: 60,
        status: 'ACTIVE',
        isPopular: true,
        categoryId: categories[0].id,
        branchIds: [branches[0].id, branches[1].id]
      }
    }),
    prisma.service.create({
      data: {
        name: 'Deep Tissue Massage',
        description: 'Therapeutic massage for muscle tension relief',
        price: 3000.00,
        duration: 75,
        status: 'ACTIVE',
        isPopular: true,
        categoryId: categories[0].id,
        branchIds: [branches[0].id, branches[1].id]
      }
    }),
    prisma.service.create({
      data: {
        name: 'Hot Stone Massage',
        description: 'Relaxing massage with heated volcanic stones',
        price: 3500.00,
        duration: 90,
        status: 'ACTIVE',
        isPopular: false,
        categoryId: categories[0].id,
        branchIds: [branches[0].id]
      }
    }),
    prisma.service.create({
      data: {
        name: 'Aromatherapy Massage',
        description: 'Therapeutic massage with essential aromatic oils',
        price: 2800.00,
        duration: 60,
        status: 'ACTIVE',
        isPopular: true,
        categoryId: categories[0].id,
        branchIds: [branches[0].id, branches[1].id]
      }
    }),

    // Facial Treatments
    prisma.service.create({
      data: {
        name: 'Classic European Facial',
        description: 'Traditional facial treatment for all skin types',
        price: 1500.00,
        duration: 45,
        status: 'ACTIVE',
        isPopular: true,
        categoryId: categories[1].id,
        branchIds: [branches[0].id, branches[1].id]
      }
    }),
    prisma.service.create({
      data: {
        name: 'Anti-Aging Gold Facial',
        description: 'Luxury anti-aging treatment with 24k gold',
        price: 4500.00,
        duration: 75,
        status: 'ACTIVE',
        isPopular: false,
        categoryId: categories[1].id,
        branchIds: [branches[0].id]
      }
    }),
    prisma.service.create({
      data: {
        name: 'Hydrating Vitamin C Facial',
        description: 'Brightening facial with vitamin C serum',
        price: 2200.00,
        duration: 60,
        status: 'ACTIVE',
        isPopular: true,
        categoryId: categories[1].id,
        branchIds: [branches[0].id, branches[1].id]
      }
    }),

    // Body Treatments
    prisma.service.create({
      data: {
        name: 'Full Body Scrub',
        description: 'Exfoliating body scrub with natural ingredients',
        price: 2000.00,
        duration: 45,
        status: 'ACTIVE',
        isPopular: true,
        categoryId: categories[2].id,
        branchIds: [branches[0].id, branches[1].id]
      }
    }),
    prisma.service.create({
      data: {
        name: 'Body Wrap Detox',
        description: 'Detoxifying body wrap treatment',
        price: 3200.00,
        duration: 60,
        status: 'ACTIVE',
        isPopular: false,
        categoryId: categories[2].id,
        branchIds: [branches[0].id]
      }
    }),

    // Hair & Scalp
    prisma.service.create({
      data: {
        name: 'Scalp Massage & Treatment',
        description: 'Nourishing scalp massage with herbal oils',
        price: 1200.00,
        duration: 30,
        status: 'ACTIVE',
        isPopular: true,
        categoryId: categories[3].id,
        branchIds: [branches[0].id, branches[1].id]
      }
    }),
    prisma.service.create({
      data: {
        name: 'Hair Spa Treatment',
        description: 'Complete hair care and conditioning treatment',
        price: 1800.00,
        duration: 60,
        status: 'ACTIVE',
        isPopular: true,
        categoryId: categories[3].id,
        branchIds: [branches[0].id, branches[1].id]
      }
    }),

    // Wellness Therapies
    prisma.service.create({
      data: {
        name: 'Reflexology',
        description: 'Pressure point therapy for feet and hands',
        price: 1800.00,
        duration: 45,
        status: 'ACTIVE',
        isPopular: true,
        categoryId: categories[4].id,
        branchIds: [branches[0].id, branches[1].id]
      }
    }),
    prisma.service.create({
      data: {
        name: 'Reiki Healing',
        description: 'Energy healing and chakra balancing',
        price: 2500.00,
        duration: 60,
        status: 'ACTIVE',
        isPopular: false,
        categoryId: categories[4].id,
        branchIds: [branches[0].id]
      }
    })
  ]);

  console.log(`Created ${services.length} services.`);

  // 6. Create Employees
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        employeeCode: 'EMP001',
        name: 'Lakshmi Devi',
        phone: '+91 9876543220',
        email: 'lakshmi@serenityspa.com',
        designation: 'Senior Massage Therapist',
        commission: 15.0,
        salary: 25000.00,
        status: 'ACTIVE',
        branchId: branches[0].id
      }
    }),
    prisma.employee.create({
      data: {
        employeeCode: 'EMP002',
        name: 'Kavitha Reddy',
        phone: '+91 9876543221',
        email: 'kavitha@serenityspa.com',
        designation: 'Facial Specialist',
        commission: 12.0,
        salary: 22000.00,
        status: 'ACTIVE',
        branchId: branches[0].id
      }
    }),
    prisma.employee.create({
      data: {
        employeeCode: 'EMP003',
        name: 'Sita Ramesh',
        phone: '+91 9876543222',
        email: 'sita@serenityspa.com',
        designation: 'Body Treatment Specialist',
        commission: 10.0,
        salary: 20000.00,
        status: 'ACTIVE',
        branchId: branches[0].id
      }
    }),
    prisma.employee.create({
      data: {
        employeeCode: 'EMP004',
        name: 'Radha Krishna',
        phone: '+91 9876543223',
        email: 'radha@serenityspa.com',
        designation: 'Wellness Therapist',
        commission: 18.0,
        salary: 28000.00,
        status: 'ACTIVE',
        branchId: branches[0].id
      }
    }),
    prisma.employee.create({
      data: {
        employeeCode: 'EMP005',
        name: 'Gita Rao',
        phone: '+91 9876543224',
        email: 'gita@serenityspa.com',
        designation: 'Senior Massage Therapist',
        commission: 15.0,
        salary: 25000.00,
        status: 'ACTIVE',
        branchId: branches[1].id
      }
    }),
    prisma.employee.create({
      data: {
        employeeCode: 'EMP006',
        name: 'Anjali Nair',
        phone: '+91 9876543225',
        email: 'anjali@serenityspa.com',
        designation: 'Hair & Scalp Specialist',
        commission: 12.0,
        salary: 21000.00,
        status: 'ACTIVE',
        branchId: branches[1].id
      }
    })
  ]);

  console.log(`Created ${employees.length} employees.`);

  // 7. Create Customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        customerCode: 'CUST001',
        name: 'Anita Sharma',
        phone: '+91 9876543230',
        email: 'anita.sharma@email.com',
        dateOfBirth: new Date('1985-06-15'),
        gender: 'FEMALE',
        address: '789 Green Colony, Tirupati, AP',
        referralSource: 'GOOGLE_ADS',
        totalSpent: 15000.00,
        visitCount: 8,
        lastVisit: new Date('2025-01-15'),
        status: 'ACTIVE'
      }
    }),
    prisma.customer.create({
      data: {
        customerCode: 'CUST002',
        name: 'Rajesh Kumar',
        phone: '+91 9876543231',
        email: 'rajesh.kumar@email.com',
        dateOfBirth: new Date('1980-03-22'),
        gender: 'MALE',
        address: '456 Blue Street, Tirupati, AP',
        referralSource: 'FRIEND_REFERRAL',
        totalSpent: 8500.00,
        visitCount: 4,
        lastVisit: new Date('2025-01-10'),
        status: 'ACTIVE',
        referredByEmployeeId: employees[0].id
      }
    }),
    prisma.customer.create({
      data: {
        customerCode: 'CUST003',
        name: 'Priyanka Reddy',
        phone: '+91 9876543232',
        email: 'priyanka.reddy@email.com',
        dateOfBirth: new Date('1992-11-08'),
        gender: 'FEMALE',
        address: '123 Rose Garden, Tirupati, AP',
        referralSource: 'SOCIAL_MEDIA',
        totalSpent: 12000.00,
        visitCount: 6,
        lastVisit: new Date('2025-01-20'),
        status: 'ACTIVE'
      }
    }),
    prisma.customer.create({
      data: {
        customerCode: 'CUST004',
        name: 'Vikram Singh',
        phone: '+91 9876543233',
        email: 'vikram.singh@email.com',
        dateOfBirth: new Date('1988-09-12'),
        gender: 'MALE',
        address: '567 Oak Avenue, Tirupati, AP',
        referralSource: 'WALK_IN',
        totalSpent: 5500.00,
        visitCount: 3,
        lastVisit: new Date('2025-01-18'),
        status: 'ACTIVE'
      }
    }),
    prisma.customer.create({
      data: {
        customerCode: 'CUST005',
        name: 'Sunita Patel',
        phone: '+91 9876543234',
        email: 'sunita.patel@email.com',
        dateOfBirth: new Date('1975-12-05'),
        gender: 'FEMALE',
        address: '890 Lotus Lane, Tirupati, AP',
        referralSource: 'EMPLOYEE_REFERRAL',
        totalSpent: 18500.00,
        visitCount: 12,
        lastVisit: new Date('2025-01-22'),
        status: 'ACTIVE',
        referredByEmployeeId: employees[1].id
      }
    })
  ]);

  console.log(`Created ${customers.length} customers.`);

  // 8. Create Memberships   
  const memberships = await Promise.all([
    prisma.membership.create({
      data: {
        membershipCode: 'MEM2025001',
        type: 'GOLD',
        price: 15000.00,
        discountPercentage: 20.0,
        startDate: new Date('2024-12-01'),
        endDate: new Date('2025-11-30'),
        status: 'ACTIVE',
        benefits: {
          discountOnServices: '20%',
          freeServices: ['Scalp Massage & Treatment'],
          priorityBooking: true,
          complimentaryRefreshments: true
        },
        customerId: customers[0].id,
        referredByEmployeeId: employees[0].id
      }
    }),
    prisma.membership.create({
      data: {
        membershipCode: 'MEM2025002',
        type: 'SILVER',
        price: 8000.00,
        discountPercentage: 15.0,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        status: 'ACTIVE',
        benefits: {
          discountOnServices: '15%',
          freeServices: [],
          priorityBooking: false,
          complimentaryRefreshments: true
        },
        customerId: customers[2].id
      }
    }),
    prisma.membership.create({
      data: {
        membershipCode: 'MEM2025003',
        type: 'PLATINUM',
        price: 25000.00,
        discountPercentage: 25.0,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2025-05-31'),
        status: 'ACTIVE',
        benefits: {
          discountOnServices: '25%',
          freeServices: ['Scalp Massage & Treatment', 'Classic European Facial'],
          priorityBooking: true,
          complimentaryRefreshments: true,
          personalTherapist: true
        },
        customerId: customers[4].id,
        referredByEmployeeId: employees[1].id
      }
    })
  ]);

  console.log(`Created ${memberships.length} memberships.`);

  // 9. Create Combos
  const combos = await Promise.all([
    prisma.combo.create({
      data: {
        name: 'Relaxation Package',
        description: 'Swedish massage with facial for complete relaxation',
        totalPrice: 4000.00,
        discountPrice: 3500.00,
        discountPercentage: 12.5,
        validityDays: 30,
        status: 'ACTIVE',
        branchId: branches[0].id
      }
    }),
    prisma.combo.create({
      data: {
        name: 'Wellness Retreat',
        description: 'Full body scrub, massage, and detox wrap',
        totalPrice: 7700.00,
        discountPrice: 6500.00,
        discountPercentage: 15.6,
        validityDays: 45,
        status: 'ACTIVE',
        branchId: branches[0].id
      }
    }),
    prisma.combo.create({
      data: {
        name: 'Beauty & Glow',
        description: 'Facial treatments with scalp massage',
        totalPrice: 3700.00,
        discountPrice: 3200.00,
        discountPercentage: 13.5,
        validityDays: 30,
        status: 'ACTIVE',
        branchId: branches[1].id
      }
    })
  ]);

  console.log(`Created ${combos.length} combos.`);

  // 10. Create Combo Services (link services to combos)
  const comboServices = await Promise.all([
    // Relaxation Package
    prisma.comboService.create({
      data: {
        comboId: combos[0].id,
        serviceId: services[0].id, // Swedish Full Body Massage
        quantity: 1
      }
    }),
    prisma.comboService.create({
      data: {
        comboId: combos[0].id,
        serviceId: services[4].id, // Classic European Facial
        quantity: 1
      }
    }),
    
    // Wellness Retreat
    prisma.comboService.create({
      data: {
        comboId: combos[1].id,
        serviceId: services[7].id, // Full Body Scrub
        quantity: 1
      }
    }),
    prisma.comboService.create({
      data: {
        comboId: combos[1].id,
        serviceId: services[1].id, // Deep Tissue Massage
        quantity: 1
      }
    }),
    prisma.comboService.create({
      data: {
        comboId: combos[1].id,
        serviceId: services[8].id, // Body Wrap Detox
        quantity: 1
      }
    }),
    
    // Beauty & Glow
    prisma.comboService.create({
      data: {
        comboId: combos[2].id,
        serviceId: services[6].id, // Hydrating Vitamin C Facial
        quantity: 1
      }
    }),
    prisma.comboService.create({
      data: {
        comboId: combos[2].id,
        serviceId: services[9].id, // Scalp Massage & Treatment
        quantity: 1
      }
    })
  ]);

  console.log(`Created ${comboServices.length} combo services.`);

  // 11. Create Coupons
  const coupons = await Promise.all([
    prisma.coupon.create({
      data: {
        code: 'WELCOME20',
        name: 'Welcome Discount',
        description: '20% off on first visit',
        discountType: 'PERCENTAGE',
        discount: 20.0,
        minimumAmount: 1000.00,
        maximumDiscount: 1000.00,
        validFrom: new Date('2025-01-01'),
        validUntil: new Date('2025-12-31'),
        usageLimit: 100,
        usagePerCustomer: 1,
        usageCount: 15,
        status: 'ACTIVE',
        applicableServices: [] // Empty means all services
      }
    }),
    prisma.coupon.create({
      data: {
        code: 'MASSAGE50',
        name: 'Massage Special',
        description: 'Rs. 500 off on massage services',
        discountType: 'FIXED_AMOUNT',
        discount: 500.0,
        minimumAmount: 2000.00,
        validFrom: new Date('2025-01-01'),
        validUntil: new Date('2025-03-31'),
        usageLimit: 50,
        usagePerCustomer: 2,
        usageCount: 8,
        status: 'ACTIVE',
        applicableServices: [services[0].id, services[1].id, services[2].id, services[3].id]
      }
    }),
    prisma.coupon.create({
      data: {
        code: 'FACIAL15',
        name: 'Facial Delight',
        description: '15% off on all facial treatments',
        discountType: 'PERCENTAGE',
        discount: 15.0,
        minimumAmount: 1500.00,
        maximumDiscount: 500.00,
        validFrom: new Date('2025-02-01'),
        validUntil: new Date('2025-04-30'),
        usageLimit: 30,
        usagePerCustomer: 1,
        usageCount: 3,
        status: 'ACTIVE',
        applicableServices: [services[4].id, services[5].id, services[6].id]
      }
    }),
    prisma.coupon.create({
      data: {
        code: 'COMBO10',
        name: 'Combo Saver',
        description: '10% additional discount on combo packages',
        discountType: 'PERCENTAGE',
        discount: 10.0,
        minimumAmount: 3000.00,
        maximumDiscount: 800.00,
        validFrom: new Date('2025-01-15'),
        validUntil: new Date('2025-06-15'),
        usageLimit: 25,
        usagePerCustomer: 1,
        usageCount: 2,
        status: 'ACTIVE',
        applicableServices: []
      }
    })
  ]);

  console.log(`Created ${coupons.length} coupons.`);

  // 12. Create Sample Transactions
  const transactions = [];
  
  // Transaction 1 - Cash payment with regular services
  const transaction1 = await prisma.transaction.create({
    data: {
      invoiceNumber: `SS-${branches[0].id.slice(-4)}-${Date.now()}-001`,
      subtotal: 4000.00,
      discount: 0.00,
      taxAmount: 720.00, // 18% GST
      tipAmount: 200.00,
      total: 4920.00,
      paymentMethod: 'CASH',
      paymentStatus: 'COMPLETED',
      notes: 'Customer very satisfied with service',
      cashierId: users[3].id, // pos user
      branchId: branches[0].id,
      customerId: customers[1].id,
      items: {
        create: [
          {
            name: 'Swedish Full Body Massage',
            price: 2500.00,
            originalPrice: 2500.00,
            quantity: 1,
            itemType: 'SERVICE',
            discount: 0.00,
            serviceId: services[0].id,
            employeeId: employees[0].id
          },
          {
            name: 'Classic European Facial',
            price: 1500.00,
            originalPrice: 1500.00,
            quantity: 1,
            itemType: 'SERVICE',
            discount: 0.00,
            serviceId: services[4].id,
            employeeId: employees[1].id
          }
        ]
      }
    },
    include: { items: true, customer: true }
  });
  transactions.push(transaction1);

  // Transaction 2 - Card payment with membership discount
  const transaction2 = await prisma.transaction.create({
    data: {
      invoiceNumber: `SS-${branches[0].id.slice(-4)}-${Date.now()}-002`,
      subtotal: 3500.00,
      discount: 700.00, // 20% membership discount
      taxAmount: 504.00, // 18% GST on discounted amount
      tipAmount: 150.00,
      total: 3454.00,
      paymentMethod: 'CARD',
      paymentStatus: 'COMPLETED',
      notes: 'Gold membership discount applied',
      cashierId: users[3].id,
      branchId: branches[0].id,
      customerId: customers[0].id, // Customer with Gold membership
      membershipId: memberships[0].id,
      items: {
        create: [
          {
            name: 'Hot Stone Massage',
            price: 2800.00, // Discounted price (3500 - 20%)
            originalPrice: 3500.00,
            quantity: 1,
            itemType: 'SERVICE',
            discount: 700.00,
            serviceId: services[2].id,
            employeeId: employees[0].id
          }
        ]
      }
    },
    include: { items: true, customer: true }
  });
  transactions.push(transaction2);

  // Transaction 3 - Combo package with coupon
  const transaction3 = await prisma.transaction.create({
    data: {
      invoiceNumber: `SS-${branches[0].id.slice(-4)}-${Date.now()}-003`,
      subtotal: 3500.00,
      discount: 350.00, // 10% coupon discount
      taxAmount: 567.00, // 18% GST
      tipAmount: 100.00,
      total: 3817.00,
      paymentMethod: 'UPI',
      paymentStatus: 'COMPLETED',
      notes: 'COMBO10 coupon applied',
      couponCode: 'COMBO10',
      cashierId: users[4].id, // Different pos user
      branchId: branches[1].id,
      customerId: customers[2].id,
      items: {
        create: [
          {
            name: 'Beauty & Glow Package',
            price: 3150.00, // Discounted combo price
            originalPrice: 3500.00,
            quantity: 1,
            itemType: 'COMBO',
            discount: 350.00,
            comboId: combos[2].id,
            employeeId: employees[4].id
          }
        ]
      }
    },
    include: { items: true, customer: true }
  });
  transactions.push(transaction3);

  // Transaction 4 - Multiple services, walk-in customer
  const transaction4 = await prisma.transaction.create({
    data: {
      invoiceNumber: `SS-${branches[1].id.slice(-4)}-${Date.now()}-004`,
      subtotal: 3000.00,
      discount: 0.00,
      taxAmount: 540.00, // 18% GST
      tipAmount: 300.00,
      total: 3840.00,
      paymentMethod: 'CARD',
      paymentStatus: 'COMPLETED',
      notes: 'Walk-in customer, very pleased with services',
      cashierId: users[4].id,
      branchId: branches[1].id,
      customerId: customers[3].id,
      items: {
        create: [
          {
            name: 'Deep Tissue Massage',
            price: 3000.00,
            originalPrice: 3000.00,
            quantity: 1,
            itemType: 'SERVICE',
            discount: 0.00,
            serviceId: services[1].id,
            employeeId: employees[4].id
          }
        ]
      }
    },
    include: { items: true, customer: true }
  });
  transactions.push(transaction4);

  console.log(`Created ${transactions.length} transactions.`);

  // 13. Create Coupon Usage Records
  const couponUsages = await Promise.all([
    prisma.couponUsage.create({
      data: {
        couponId: coupons[3].id, // COMBO10
        customerId: customers[2].id,
        transactionId: transaction3.id
      }
    })
  ]);

  console.log(`Created ${couponUsages.length} coupon usage records.`);

  // Update customer statistics based on transactions
  await Promise.all([
    prisma.customer.update({
      where: { id: customers[1].id },
      data: { 
        totalSpent: 4920.00,
        visitCount: 1,
        lastVisit: new Date()
      }
    }),
    prisma.customer.update({
      where: { id: customers[0].id },
      data: { 
        totalSpent: { increment: 3454.00 },
        visitCount: { increment: 1 },
        lastVisit: new Date()
      }
    }),
    prisma.customer.update({
      where: { id: customers[2].id },
      data: { 
        totalSpent: { increment: 3817.00 },
        visitCount: { increment: 1 },
        lastVisit: new Date()
      }
    }),
    prisma.customer.update({
      where: { id: customers[3].id },
      data: { 
        totalSpent: { increment: 3840.00 },
        visitCount: { increment: 1 },
        lastVisit: new Date()
      }
    })
  ]);

  console.log('Updated customer statistics.');

  console.log('🌟 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`✅ System Settings: ${systemSettings.length}`);
  console.log(`✅ Branches: ${branches.length}`);
  console.log(`✅ Users: ${users.length}`);
  console.log(`✅ Categories: ${categories.length}`);
  console.log(`✅ Services: ${services.length}`);
  console.log(`✅ Employees: ${employees.length}`);
  console.log(`✅ Customers: ${customers.length}`);
  console.log(`✅ Memberships: ${memberships.length}`);
  console.log(`✅ Combos: ${combos.length}`);
  console.log(`✅ Combo Services: ${comboServices.length}`);
  console.log(`✅ Coupons: ${coupons.length}`);
  console.log(`✅ Transactions: ${transactions.length}`);
  console.log(`✅ Coupon Usages: ${couponUsages.length}`);
  
  console.log('\n👤 Test Credentials:');
  console.log('admin: username="admin", password="admin123"');
  console.log('manager: username="manager1", password="manager123"');
  console.log('pos: username="pos1", password="pos123"');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });  