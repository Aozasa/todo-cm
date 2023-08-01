-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('HIGH', 'MIDDLE', 'LOW');

-- CreateTable
CREATE TABLE "Todos" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL,
    "closedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "priority" "Priority",
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Todos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Todos_title_username_key" ON "Todos"("title", "username");
