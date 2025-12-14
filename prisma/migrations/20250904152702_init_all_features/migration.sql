/*
  Warnings:

  - The `status` column on the `branches` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `categories` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `combos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `coupons` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `employees` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `memberships` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `services` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name]` on the table `branches` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerCode]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employeeCode]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `branches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountPercentage` to the `combos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `combos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerCode` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeCode` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `memberships` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalPrice` to the `transaction_items` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `itemType` on the `transaction_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `paymentMethod` on the `transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'POS');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "BranchStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED');

-- CreateEnum
CREATE TYPE "CategoryStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DISCONTINUED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'UPI', 'NET_BANKING', 'WALLET', 'SPLIT_PAYMENT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('SERVICE', 'COMBO', 'PRODUCT', 'MEMBERSHIP');

-- CreateEnum
CREATE TYPE "ComboStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED');

-- CreateEnum
CREATE TYPE "MembershipType" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'ANNUAL', 'LIFETIME');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- CreateEnum
CREATE TYPE "CouponStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ReferralSource" ADD VALUE 'WEBSITE';
ALTER TYPE "ReferralSource" ADD VALUE 'RETURN_CUSTOMER';

-- DropForeignKey
ALTER TABLE "combo_services" DROP CONSTRAINT "combo_services_comboId_fkey";

-- AlterTable
ALTER TABLE "branches" ADD COLUMN     "operatingHours" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "BranchStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "CategoryStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "combos" ADD COLUMN     "discountPercentage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "validityDays" INTEGER,
DROP COLUMN "status",
ADD COLUMN     "status" "ComboStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "coupons" ADD COLUMN     "applicableServices" TEXT[],
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "discountType" "DiscountType" NOT NULL DEFAULT 'PERCENTAGE',
ADD COLUMN     "maximumDiscount" DOUBLE PRECISION,
ADD COLUMN     "minimumAmount" DOUBLE PRECISION,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usagePerCustomer" INTEGER,
DROP COLUMN "status",
ADD COLUMN     "status" "CouponStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "address" TEXT,
ADD COLUMN     "customerCode" TEXT NOT NULL,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "lastVisit" TIMESTAMP(3),
ADD COLUMN     "status" "CustomerStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "visitCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "employeeCode" TEXT NOT NULL,
ADD COLUMN     "hireDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "salary" DOUBLE PRECISION,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "memberships" ADD COLUMN     "benefits" JSONB,
ADD COLUMN     "discountPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
DROP COLUMN "type",
ADD COLUMN     "type" "MembershipType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "isPopular" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ServiceStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "transaction_items" ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "originalPrice" DOUBLE PRECISION NOT NULL,
DROP COLUMN "itemType",
ADD COLUMN     "itemType" "ItemType" NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "couponCode" TEXT,
ADD COLUMN     "membershipId" TEXT,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'COMPLETED',
ADD COLUMN     "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'POS',
DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "coupon_usage" (
    "id" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupon_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coupon_usage_couponId_customerId_transactionId_key" ON "coupon_usage"("couponId", "customerId", "transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "branches_name_key" ON "branches"("name");

-- CreateIndex
CREATE UNIQUE INDEX "customers_customerCode_key" ON "customers"("customerCode");

-- CreateIndex
CREATE UNIQUE INDEX "employees_employeeCode_key" ON "employees"("employeeCode");

-- AddForeignKey
ALTER TABLE "combo_services" ADD CONSTRAINT "combo_services_comboId_fkey" FOREIGN KEY ("comboId") REFERENCES "combos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
