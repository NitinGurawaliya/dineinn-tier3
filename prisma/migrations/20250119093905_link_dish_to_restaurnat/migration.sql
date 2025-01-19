/*
  Warnings:

  - You are about to drop the column `Facebook` on the `RestaurantDetail` table. All the data in the column will be lost.
  - You are about to drop the column `Instagram` on the `RestaurantDetail` table. All the data in the column will be lost.
  - You are about to drop the column `Logo` on the `RestaurantDetail` table. All the data in the column will be lost.
  - You are about to drop the column `WeekdaysWorking` on the `RestaurantDetail` table. All the data in the column will be lost.
  - You are about to drop the column `WeekendWorking` on the `RestaurantDetail` table. All the data in the column will be lost.
  - Added the required column `restaurantId` to the `Dishes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dishes" ADD COLUMN     "restaurantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RestaurantDetail" DROP COLUMN "Facebook",
DROP COLUMN "Instagram",
DROP COLUMN "Logo",
DROP COLUMN "WeekdaysWorking",
DROP COLUMN "WeekendWorking",
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "weekdaysWorking" TEXT,
ADD COLUMN     "weekendWorking" TEXT;

-- AddForeignKey
ALTER TABLE "Dishes" ADD CONSTRAINT "Dishes_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "RestaurantDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
