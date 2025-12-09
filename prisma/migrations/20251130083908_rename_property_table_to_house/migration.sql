/*
  Warnings:

  - You are about to drop the `Property` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "HouseStatus" AS ENUM ('AVAILABLE', 'PENDING', 'SOLD', 'RENTED');

-- CreateEnum
CREATE TYPE "HousePurpose" AS ENUM ('FOR_RENT', 'FOR_SALE');

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_divisionId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_houseTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_neighborhoodId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_regionId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_subdivisionId_fkey";

-- DropTable
DROP TABLE "Property";

-- DropEnum
DROP TYPE "PropertyPurpose";

-- DropEnum
DROP TYPE "PropertyStatus";

-- CreateTable
CREATE TABLE "House" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "location" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "hasInternalToilet" BOOLEAN NOT NULL,
    "hasParking" BOOLEAN NOT NULL,
    "hasWell" BOOLEAN NOT NULL,
    "purpose" "HousePurpose" NOT NULL DEFAULT 'FOR_RENT',
    "status" "HouseStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "regionId" TEXT NOT NULL,
    "divisionId" TEXT NOT NULL,
    "subdivisionId" TEXT NOT NULL,
    "neighborhoodId" TEXT NOT NULL,
    "houseTypeId" TEXT NOT NULL,

    CONSTRAINT "House_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "House" ADD CONSTRAINT "House_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "House" ADD CONSTRAINT "House_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "House" ADD CONSTRAINT "House_subdivisionId_fkey" FOREIGN KEY ("subdivisionId") REFERENCES "Subdivision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "House" ADD CONSTRAINT "House_neighborhoodId_fkey" FOREIGN KEY ("neighborhoodId") REFERENCES "Neighborhood"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "House" ADD CONSTRAINT "House_houseTypeId_fkey" FOREIGN KEY ("houseTypeId") REFERENCES "HouseType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "House"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
