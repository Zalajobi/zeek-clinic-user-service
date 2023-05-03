/*
  Warnings:

  - A unique constraint covering the columns `[patient_id]` on the table `profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "unit" AS ENUM ('BURN', 'CARDIOLOGY', 'CORONARY_CARE', 'DAY_SURGERY', 'DIALYSIS', 'EMERGENCY_ROOM', 'GASTROENTEROLOGY', 'Gynecology', 'Geriatric', 'INTENSIVE_CARE_UNIT', 'LABOUR_AND_DELIVERY', 'MEDICINE', 'Nephrology', 'Neurology', 'Neonatal_Intensive_Care_Unit', 'OPERATING_ROOM', 'OUTPATIENT', 'INPATIENT', 'Orthopedic', 'Palliative_Care', 'PRE_ADMISSION', 'PEDIATRIC', 'Pediatric_Intensive_Care', 'POSTPARTUM', 'PSYCHIATRY', 'PULMONARY', 'RECOVERY', 'REHABILITATION', 'SPECIALTY', 'SURGERY', 'UROLOGY');

-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "password_reset_code" VARCHAR(6),
ADD COLUMN     "password_reset_request_timestamp" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "patient_id" TEXT;

-- CreateTable
CREATE TABLE "super_admin" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "username" VARCHAR(60) NOT NULL,
    "phone_number" VARCHAR(20),
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "other_name" VARCHAR(100),
    "country" VARCHAR(50),
    "state" VARCHAR(100),
    "zip_code" VARCHAR(10),
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "super_admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient" (
    "id" TEXT NOT NULL,
    "id_number" TEXT NOT NULL,
    "id_type" TEXT NOT NULL,
    "employer" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "is_admitted" BOOLEAN NOT NULL DEFAULT true,
    "email" VARCHAR(60) NOT NULL,
    "username" VARCHAR(60) NOT NULL,
    "phone_number" VARCHAR(20),
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "other_name" VARCHAR(100),

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allergies" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "allergy" TEXT NOT NULL,

    CONSTRAINT "allergies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "super_admin_id_key" ON "super_admin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "super_admin_email_key" ON "super_admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "super_admin_username_key" ON "super_admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "super_admin_phone_number_key" ON "super_admin"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "patient_id_key" ON "patient"("id");

-- CreateIndex
CREATE UNIQUE INDEX "patient_email_key" ON "patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patient_username_key" ON "patient"("username");

-- CreateIndex
CREATE UNIQUE INDEX "patient_phone_number_key" ON "patient"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "allergies_id_key" ON "allergies"("id");

-- CreateIndex
CREATE UNIQUE INDEX "profile_patient_id_key" ON "profile"("patient_id");

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allergies" ADD CONSTRAINT "allergies_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
