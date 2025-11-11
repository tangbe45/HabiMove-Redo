/*
  Warnings:

  - You are about to drop the column `hasAWell` on the `Property` table. All the data in the column will be lost.
  - Added the required column `hasWell` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "hasAWell",
ADD COLUMN     "hasWell" BOOLEAN NOT NULL;
