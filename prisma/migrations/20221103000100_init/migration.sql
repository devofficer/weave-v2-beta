-- CreateTable
CREATE TABLE `strategies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `contractAddress` VARCHAR(255) NOT NULL DEFAULT '',
    `chainId` INTEGER NOT NULL,
    `historicApy` FLOAT NOT NULL,
    `popularity` TINYINT NOT NULL,
    `risk` VARCHAR(255) NOT NULL,
    `label` VARCHAR(255) NULL,
    `status` TINYINT NOT NULL,
    `strategyData` LONGTEXT NOT NULL,
    `userAddress` VARCHAR(255) NOT NULL,
    `referrerAddress` VARCHAR(255) NULL,
    `version` INTEGER NOT NULL DEFAULT 0,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `strategyName`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL DEFAULT '',
    `address` VARCHAR(255) NOT NULL DEFAULT '',
    `avatar` VARCHAR(255) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `farms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(255) NOT NULL,
    `project` VARCHAR(255) NOT NULL,
    `poolId` INTEGER NOT NULL,
    `chainId` INTEGER NOT NULL,
    `token1Address` VARCHAR(255) NULL,
    `token1Name` VARCHAR(255) NULL,
    `token1Symbol` VARCHAR(255) NULL,
    `token2Address` VARCHAR(255) NULL,
    `token2Name` VARCHAR(255) NULL,
    `token2Symbol` VARCHAR(255) NULL,
    `apr` VARCHAR(255) NULL,
    `tvl` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chainId` INTEGER NOT NULL,
    `name` VARCHAR(255) NULL,
    `symbol` VARCHAR(255) NOT NULL,
    `decimals` INTEGER NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `logoURI` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
