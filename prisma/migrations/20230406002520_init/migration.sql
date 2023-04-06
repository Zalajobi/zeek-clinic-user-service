-- CreateEnum
CREATE TYPE "admin_role" AS ENUM ('ADMIN', 'SUPER_ADMIN', 'RECORDS', 'CASHIER');

-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "role" "admin_role" NOT NULL DEFAULT 'ADMIN';
