-- Migration: Create price_history and price_daily tables

CREATE TABLE IF NOT EXISTS price_history (
	id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	source TEXT NOT NULL,
	gold_type TEXT NOT NULL DEFAULT 'unknown',
	weight REAL NOT NULL DEFAULT 1,
	weight_unit TEXT NOT NULL DEFAULT 'gram',
	sell_price INTEGER NOT NULL DEFAULT 0,
	buyback_price INTEGER,
	currency TEXT NOT NULL DEFAULT 'IDR',
	recorded_at INTEGER NOT NULL,
	created_at INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_history_source_recorded ON price_history (source, recorded_at);