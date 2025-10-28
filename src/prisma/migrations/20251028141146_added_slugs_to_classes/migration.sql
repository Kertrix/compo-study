/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Class` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Class_slug_key" ON "Class"("slug");
