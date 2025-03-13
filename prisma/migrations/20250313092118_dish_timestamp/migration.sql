/*
  Warnings:

  - You are about to drop the column `createdAt` on the `DishView` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DishView" DROP COLUMN "createdAt",
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
