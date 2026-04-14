-- CreateTable
CREATE TABLE `Transaction` (
    `id` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `tStamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `txHash` VARCHAR(191) NOT NULL,
    `txType` ENUM('MINT', 'SELL', 'BUY', 'CANCEL', 'UPDATE') NOT NULL,

    UNIQUE INDEX `Transaction_address_key`(`address`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
