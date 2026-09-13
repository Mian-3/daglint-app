/*
  Warnings:

  - A unique constraint covering the columns `[guestId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "guestId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "guestName" TEXT,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "isApproved" SET DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Cart_guestId_key" ON "Cart"("guestId");
