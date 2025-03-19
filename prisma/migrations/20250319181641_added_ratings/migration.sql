-- CreateTable
CREATE TABLE "RestaurantRating" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "message" TEXT,
    "restaurantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestaurantRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RestaurantRating" ADD CONSTRAINT "RestaurantRating_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "RestaurantDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
