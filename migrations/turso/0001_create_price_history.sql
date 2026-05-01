CREATE TABLE `price_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source` text NOT NULL,
	`gold_type` text DEFAULT 'unknown' NOT NULL,
	`weight` real DEFAULT 1 NOT NULL,
	`weight_unit` text DEFAULT 'gram' NOT NULL,
	`sell_price` integer DEFAULT 0 NOT NULL,
	`buyback_price` integer,
	`currency` text DEFAULT 'IDR' NOT NULL,
	`recorded_at` integer NOT NULL,
	`created_at` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_history_source_recorded` ON `price_history` (`source`,`recorded_at`);