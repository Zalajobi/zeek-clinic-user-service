/*
  Warnings:

  - You are about to drop the column `other_name` on the `profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "other_name" VARCHAR(100);

-- AlterTable
ALTER TABLE "profile" DROP COLUMN "other_name";
