/*
  Warnings:

  - Added the required column `hasAGarage` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasAWell` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "hasAGarage" BOOLEAN NOT NULL,
ADD COLUMN     "hasAWell" BOOLEAN NOT NULL;
