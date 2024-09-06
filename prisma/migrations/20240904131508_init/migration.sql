-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passkey_type` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_username_email_passkey_type_key`(`username`, `email`, `passkey_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account` (
    `owner_id` INTEGER NOT NULL,
    `chain_id` INTEGER NOT NULL,
    `account_address` VARCHAR(191) NOT NULL,
    `entry_address` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`owner_id`, `chain_id`, `account_address`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
