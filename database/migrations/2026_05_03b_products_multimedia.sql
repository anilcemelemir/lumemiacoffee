-- ---------------------------------------------------------------
-- Migration: 2026-05-03 (b)
-- Add multimedia (video_url) and pinning (is_featured) to products.
-- Idempotent.
-- ---------------------------------------------------------------

SET NAMES utf8mb4;

-- Add columns if missing -----------------------------------------
SET @col_video := (
    SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'products'
      AND COLUMN_NAME  = 'video_url'
);
SET @sql := IF(@col_video = 0,
    'ALTER TABLE products ADD COLUMN video_url VARCHAR(500) NULL AFTER image_url',
    'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_feat := (
    SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'products'
      AND COLUMN_NAME  = 'is_featured'
);
SET @sql := IF(@col_feat = 0,
    'ALTER TABLE products ADD COLUMN is_featured TINYINT(1) NOT NULL DEFAULT 0 AFTER is_available',
    'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Add featured index if missing ----------------------------------
SET @idx_feat := (
    SELECT COUNT(*) FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'products'
      AND INDEX_NAME   = 'idx_products_featured'
);
SET @sql := IF(@idx_feat = 0,
    'ALTER TABLE products ADD KEY idx_products_featured (is_featured)',
    'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
