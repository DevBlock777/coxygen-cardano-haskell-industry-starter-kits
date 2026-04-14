-- DropIndex
DROP INDEX `Transaction_address_key` ON `transaction`;

-- AlterTable
ALTER TABLE `transaction` ADD PRIMARY KEY (`id`);
