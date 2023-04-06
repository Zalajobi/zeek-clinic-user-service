/*
  Warnings:

  - You are about to drop the column `first_name` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `profile` table. All the data in the column will be lost.
  - Added the required column `first_name` to the `admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "first_name" VARCHAR(100) NOT NULL,
ADD COLUMN     "last_name" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "profile" DROP COLUMN "first_name",
DROP COLUMN "last_name";
