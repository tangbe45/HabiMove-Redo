/*
  Warnings:

  - Made the column `bedrooms` on table `Property` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bathrooms` on table `Property` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hasInternalToilet` on table `Property` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hasParking` on table `Property` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hasWell` on table `Property` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "bedrooms" SET NOT NULL,
ALTER COLUMN "bathrooms" SET NOT NULL,
ALTER COLUMN "hasInternalToilet" SET NOT NULL,
ALTER COLUMN "hasParking" SET NOT NULL,
ALTER COLUMN "hasWell" SET NOT NULL;
