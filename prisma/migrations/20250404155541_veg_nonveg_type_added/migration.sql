-- CreateEnum
CREATE TYPE "DishType" AS ENUM ('VEG', 'NON_VEG');

-- AlterTable
ALTER TABLE "Dishes" ADD COLUMN     "type" "DishType" NOT NULL DEFAULT 'VEG';
