/*
  Warnings:

  - Added the required column `hasBalcony` to the `House` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasFence` to the `House` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "House" ADD COLUMN     "hasBalcony" BOOLEAN NOT NULL,
ADD COLUMN     "hasFence" BOOLEAN NOT NULL;
