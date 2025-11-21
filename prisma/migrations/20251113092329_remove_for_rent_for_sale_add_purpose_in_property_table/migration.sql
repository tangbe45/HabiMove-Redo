/*
  Warnings:

  - You are about to drop the column `forRent` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `forSale` on the `Property` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PropertyPurpose" AS ENUM ('FOR_RENT', 'FOR_SALE');

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "forRent",
DROP COLUMN "forSale",
ADD COLUMN     "purpose" "PropertyPurpose" NOT NULL DEFAULT 'FOR_RENT';
