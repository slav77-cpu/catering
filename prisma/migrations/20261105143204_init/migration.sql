-- CreateEnum
CREATE TYPE "MenuType" AS ENUM ('RESTAURANT', 'CATERING');

-- CreateTable
CREATE TABLE "MenuCategory" (
    "id" TEXT NOT NULL,
    "type" "MenuType" NOT NULL DEFAULT 'RESTAURANT',
    "name" TEXT NOT NULL,
    "note" TEXT,
    "parentId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "portion" TEXT,
    "note" TEXT,
    "isVegetarian" BOOLEAN NOT NULL DEFAULT false,
    "priceEur" DECIMAL(10,2) NOT NULL,
    "priceBgn" DECIMAL(10,2) NOT NULL,
    "allergens" INTEGER[],
    "imagePublicId" TEXT,
    "imageAlt" TEXT,
    "imageWidth" INTEGER,
    "imageHeight" INTEGER,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryPhoto" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "caption" TEXT,
    "eventDate" DATE,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginAttempt" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "MenuCategory_type_parentId_sortOrder_idx" ON "MenuCategory"("type", "parentId", "sortOrder");

-- CreateIndex
CREATE INDEX "MenuItem_categoryId_sortOrder_idx" ON "MenuItem"("categoryId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryPhoto_publicId_key" ON "GalleryPhoto"("publicId");

-- CreateIndex
CREATE INDEX "GalleryPhoto_isVisible_sortOrder_idx" ON "GalleryPhoto"("isVisible", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- AddForeignKey
ALTER TABLE "MenuCategory" ADD CONSTRAINT "MenuCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "MenuCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MenuCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
