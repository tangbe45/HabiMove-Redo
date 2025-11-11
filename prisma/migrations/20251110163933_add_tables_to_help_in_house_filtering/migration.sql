/*
  Warnings:

  - You are about to drop the column `hasAGarage` on the `Property` table. All the data in the column will be lost.
  - Added the required column `divisionId` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasParking` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `houseTypeId` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhoodId` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regionId` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subdivisionId` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "hasAGarage",
ADD COLUMN     "divisionId" TEXT NOT NULL,
ADD COLUMN     "hasParking" BOOLEAN NOT NULL,
ADD COLUMN     "houseTypeId" TEXT NOT NULL,
ADD COLUMN     "neighborhoodId" TEXT NOT NULL,
ADD COLUMN     "regionId" TEXT NOT NULL,
ADD COLUMN     "subdivisionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "HouseType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "HouseType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Division" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "Division_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subdivision" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "divisionId" TEXT NOT NULL,

    CONSTRAINT "Subdivision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Neighborhood" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subdivisionId" TEXT NOT NULL,

    CONSTRAINT "Neighborhood_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HouseType_name_key" ON "HouseType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_subdivisionId_fkey" FOREIGN KEY ("subdivisionId") REFERENCES "Subdivision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_neighborhoodId_fkey" FOREIGN KEY ("neighborhoodId") REFERENCES "Neighborhood"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_houseTypeId_fkey" FOREIGN KEY ("houseTypeId") REFERENCES "HouseType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Division" ADD CONSTRAINT "Division_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subdivision" ADD CONSTRAINT "Subdivision_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Neighborhood" ADD CONSTRAINT "Neighborhood_subdivisionId_fkey" FOREIGN KEY ("subdivisionId") REFERENCES "Subdivision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
