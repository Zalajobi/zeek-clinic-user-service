-- CreateEnum
CREATE TYPE "admin_role" AS ENUM ('ADMIN', 'SUPER_ADMIN', 'RECORDS', 'CASHIER');

-- CreateEnum
CREATE TYPE "care_giver_roles" AS ENUM ('DENTAL_ASSISTANT', 'NURSING_ASSISTANT', 'MEDICAL_ASSISTANT', 'PHYSICIAN_ASSISTANT', 'PHYSICAL_THERAPY_ASSISTANT', 'MRI_TECHNICIAN', 'PHARMACY_TECHNICIAN', 'VETERINARY_TECHNICIAN', 'LABORATORY_TECHNICIAN', 'CARDIOVASCULAR_TECHNICIAN', 'RADIOLOGIC_TECHNICIAN', 'MEDICAL_TECHNICIAN', 'PHYSIOTHERAPIST', 'MASSAGE_THERAPIST', 'RESPIRATORY_THERAPIST', 'OCCUPATIONAL_THERAPIST', 'PHYSICAL_THERAPIST', 'DENTAL_HYGIENIST', 'PSYCHIATRIC_AIDE', 'NURSE_ANESTHETIST', 'DISPENSING_OPTICIAN', 'FAMILY_PRACTITIONER', 'MEDICAL_SONOGRAPHER', 'SURGICAL_TECHNOLOGIST', 'MEDICAL_EQUIPMENT_MANAGER', 'NURSE', 'DOCTOR', 'DENTIST', 'SURGEON', 'DIETITIAN', 'PHYSICIAN', 'THERAPIST', 'DIETICIAN', 'PHARMACIST', 'PODIATRISTS', 'OPTOMETRIST', 'RADIOLOGIST', 'PHLEBOTOMIST', 'VETERINARIAN', 'PEDIATRICIAN', 'CHIROPRACTOR', 'PSYCHIATRIST', 'OBSTETRICIAN', 'ANESTHESIOLOGIST');

-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "username" VARCHAR(60) NOT NULL,
    "phone_number" VARCHAR(20),
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "other_name" VARCHAR(100),
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role" "admin_role" NOT NULL DEFAULT 'ADMIN',

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile" (
    "id" TEXT NOT NULL,
    "gender" VARCHAR(100) NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(100),
    "bio" VARCHAR(255),
    "address" VARCHAR(255),
    "address_two" VARCHAR(255),
    "state" VARCHAR(100),
    "zip_code" VARCHAR(10),
    "country" VARCHAR(50),
    "country_code" VARCHAR(5),
    "admin_id" TEXT,
    "provider_id" TEXT,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "username" VARCHAR(60) NOT NULL,
    "phone_number" VARCHAR(20),
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "other_name" VARCHAR(100),
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_role" (
    "id" TEXT NOT NULL,
    "role" "care_giver_roles" NOT NULL,
    "provider_id" TEXT NOT NULL,

    CONSTRAINT "provider_role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_id_key" ON "admin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_username_key" ON "admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "admin_phone_number_key" ON "admin"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "profile_id_key" ON "profile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "profile_admin_id_key" ON "profile"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "profile_provider_id_key" ON "profile"("provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "provider_id_key" ON "provider"("id");

-- CreateIndex
CREATE UNIQUE INDEX "provider_email_key" ON "provider"("email");

-- CreateIndex
CREATE UNIQUE INDEX "provider_username_key" ON "provider"("username");

-- CreateIndex
CREATE UNIQUE INDEX "provider_phone_number_key" ON "provider"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "provider_role_id_key" ON "provider_role"("id");

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_role" ADD CONSTRAINT "provider_role_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
