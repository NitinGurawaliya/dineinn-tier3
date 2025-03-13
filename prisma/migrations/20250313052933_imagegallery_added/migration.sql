-- CreateTable
CREATE TABLE "RestaurantGallery" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "RestaurantGallery_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RestaurantGallery" ADD CONSTRAINT "RestaurantGallery_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "RestaurantDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
