-- CreateTable
CREATE TABLE "Dishes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "image" TEXT,
    "tags" TEXT[],

    CONSTRAINT "Dishes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Dishes" ADD CONSTRAINT "Dishes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
