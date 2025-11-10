/*
  Warnings:

  - Added the required column `authorId` to the `Ressource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PROFESSOR', 'MODERATOR', 'STUDENT');

-- AlterTable
ALTER TABLE "Ressource" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "Role" NOT NULL;

-- AddForeignKey
ALTER TABLE "Ressource" ADD CONSTRAINT "Ressource_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
