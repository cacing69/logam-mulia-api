CREATE TABLE IF NOT EXISTS price_history (
	id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	source TEXT NOT NULL,
	material TEXT NOT NULL DEFAULT 'gold',
	material_type TEXT NOT NULL DEFAULT 'unknown',
	weight REAL NOT NULL DEFAULT 1,
	weight_unit TEXT NOT NULL DEFAULT 'gram',
	sell_price INTEGER NOT NULL DEFAULT 0,
	buyback_price INTEGER,
	currency TEXT NOT NULL DEFAULT 'IDR',
	created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_history_source_created ON price_history (source, created_at);
