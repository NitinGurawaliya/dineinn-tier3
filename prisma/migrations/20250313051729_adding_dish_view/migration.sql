-- CreateTable
CREATE TABLE "DishView" (
    "id" SERIAL NOT NULL,
    "dishId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DishView_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DishView" ADD CONSTRAINT "DishView_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dishes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
