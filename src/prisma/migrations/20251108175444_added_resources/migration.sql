-- CreateEnum
CREATE TYPE "RessourceType" AS ENUM ('TEXT', 'DOCUMENT', 'IMAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('COURSE', 'REVISION', 'OTHER');

-- CreateTable
CREATE TABLE "Ressource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "resourceType" "RessourceType" NOT NULL,
    "textContent" TEXT,
    "fileUrl" TEXT,
    "mimeType" TEXT,
    "type" "Type" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "Ressource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ressource" ADD CONSTRAINT "Ressource_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
