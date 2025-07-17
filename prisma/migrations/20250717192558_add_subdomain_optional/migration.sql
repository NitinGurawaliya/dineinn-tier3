/*
  Warnings:

  - A unique constraint covering the columns `[restaurantName]` on the table `RestaurantDetail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subdomain]` on the table `RestaurantDetail` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RestaurantDetail" ADD COLUMN     "subdomain" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantDetail_restaurantName_key" ON "RestaurantDetail"("restaurantName");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantDetail_subdomain_key" ON "RestaurantDetail"("subdomain");
