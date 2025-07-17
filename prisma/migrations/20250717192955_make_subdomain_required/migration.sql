/*
  Warnings:

  - Made the column `subdomain` on table `RestaurantDetail` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "RestaurantDetail" ALTER COLUMN "subdomain" SET NOT NULL;
