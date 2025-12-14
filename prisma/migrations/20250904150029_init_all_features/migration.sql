/*
  Warnings:

  - You are about to drop the column `cashier` on the `transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invoiceNumber]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemType` to the `transaction_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branchId` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - The required column `cashierId` was added to the `transactions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `invoiceNumber` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReferralSource" AS ENUM ('WALK_IN', 'GOOGLE_ADS', 'NEARBY_COUPON', 'FRIEND_REFERRAL', 'EMPLOYEE_REFERRAL', 'SOCIAL_MEDIA', 'OTHER');

-- AlterTable
ALTER TABLE "branches" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "referralDetails" TEXT,
ADD COLUMN     "referralSource" "ReferralSource" NOT NULL DEFAULT 'WALK_IN',
ADD COLUMN     "referredByEmployeeId" TEXT;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "transaction_items" ADD COLUMN     "comboId" TEXT,
ADD COLUMN     "employeeId" TEXT,
ADD COLUMN     "itemType" TEXT NOT NULL,
ADD COLUMN     "serviceId" TEXT;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "cashier",
ADD COLUMN     "branchId" TEXT NOT NULL,
ADD COLUMN     "cashierId" TEXT NOT NULL,
ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "invoiceNumber" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "tipAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "designation" TEXT NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "branchId" TEXT NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "discountPrice" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "branchId" TEXT NOT NULL,

    CONSTRAINT "combos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combo_services" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "comboId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "combo_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "membershipCode" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "customerId" TEXT NOT NULL,
    "referredByEmployeeId" TEXT,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "usageLimit" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_phone_key" ON "employees"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "combo_services_comboId_serviceId_key" ON "combo_services"("comboId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_membershipCode_key" ON "memberships"("membershipCode");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_invoiceNumber_key" ON "transactions"("invoiceNumber");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_referredByEmployeeId_fkey" FOREIGN KEY ("referredByEmployeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_items" ADD CONSTRAINT "transaction_items_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_items" ADD CONSTRAINT "transaction_items_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_items" ADD CONSTRAINT "transaction_items_comboId_fkey" FOREIGN KEY ("comboId") REFERENCES "combos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combos" ADD CONSTRAINT "combos_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_services" ADD CONSTRAINT "combo_services_comboId_fkey" FOREIGN KEY ("comboId") REFERENCES "combos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_services" ADD CONSTRAINT "combo_services_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_referredByEmployeeId_fkey" FOREIGN KEY ("referredByEmployeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
