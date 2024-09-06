/*
  Warnings:

  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `account_owner_id_fkey`;

-- DropTable
DROP TABLE `account`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passkeyType` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_username_email_passkeyType_key`(`username`, `email`, `passkeyType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `ownerId` INTEGER NOT NULL,
    `chainId` INTEGER NOT NULL,
    `accountAddress` VARCHAR(191) NOT NULL,
    `entryAddress` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ownerId`, `chainId`, `accountAddress`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
