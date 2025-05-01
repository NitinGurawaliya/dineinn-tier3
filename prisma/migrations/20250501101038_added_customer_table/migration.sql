-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "DOB" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CustomerToRestaurantDetail" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CustomerToRestaurantDetail_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_mobile_key" ON "Customer"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "_CustomerToRestaurantDetail_B_index" ON "_CustomerToRestaurantDetail"("B");

-- AddForeignKey
ALTER TABLE "_CustomerToRestaurantDetail" ADD CONSTRAINT "_CustomerToRestaurantDetail_A_fkey" FOREIGN KEY ("A") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomerToRestaurantDetail" ADD CONSTRAINT "_CustomerToRestaurantDetail_B_fkey" FOREIGN KEY ("B") REFERENCES "RestaurantDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
