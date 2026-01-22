-- AlterTable
ALTER TABLE `User` ADD COLUMN `status` ENUM('active', 'blocked') NOT NULL DEFAULT 'active';
