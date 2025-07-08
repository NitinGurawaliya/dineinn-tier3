-- CreateTable
CREATE TABLE "DailyQRScan" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "scanDate" DATE NOT NULL,
    "scanCount" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyQRScan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyQRScan_restaurantId_scanDate_key" ON "DailyQRScan"("restaurantId", "scanDate");

-- AddForeignKey
ALTER TABLE "DailyQRScan" ADD CONSTRAINT "DailyQRScan_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "RestaurantDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
