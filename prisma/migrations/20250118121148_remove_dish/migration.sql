/*
  Warnings:

  - You are about to drop the `Dishes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Dishes" DROP CONSTRAINT "Dishes_categoryId_fkey";

-- DropTable
DROP TABLE "Dishes";
