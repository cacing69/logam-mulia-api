-- Skema final + reset bersih (selaras D1).
DROP TABLE IF EXISTS price_history;

CREATE TABLE `price_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source` text NOT NULL,
	`material` text DEFAULT 'gold' NOT NULL,
	`material_type` text DEFAULT 'unknown' NOT NULL,
	`weight` real DEFAULT 1 NOT NULL,
	`weight_unit` text DEFAULT 'gram' NOT NULL,
	`sell_price` integer DEFAULT 0 NOT NULL,
	`buyback_price` integer,
	`currency` text DEFAULT 'IDR' NOT NULL,
	`recorded_date` text NOT NULL,
	`created_at` text NOT NULL,
	`line_key` text DEFAULT '' NOT NULL,
	UNIQUE (`source`, `recorded_date`, `material_type`, `weight`, `weight_unit`, `line_key`)
);

CREATE INDEX `idx_history_source_recorded_date` ON `price_history` (`source`, `recorded_date`);
