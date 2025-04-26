-- DropForeignKey
ALTER TABLE "DishView" DROP CONSTRAINT "DishView_dishId_fkey";

-- AddForeignKey
ALTER TABLE "DishView" ADD CONSTRAINT "DishView_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
