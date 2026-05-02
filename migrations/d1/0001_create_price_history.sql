-- Skema final + reset bersih (jalankan setelah hapus jejak migrasi / DB kosong).
DROP TABLE IF EXISTS price_history;

CREATE TABLE price_history (
	id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	source TEXT NOT NULL,
	material TEXT NOT NULL DEFAULT 'gold',
	material_type TEXT NOT NULL DEFAULT 'unknown',
	weight REAL NOT NULL DEFAULT 1,
	weight_unit TEXT NOT NULL DEFAULT 'gram',
	sell_price INTEGER NOT NULL DEFAULT 0,
	buyback_price INTEGER,
	currency TEXT NOT NULL DEFAULT 'IDR',
	recorded_date TEXT NOT NULL,
	created_at TEXT NOT NULL,
	UNIQUE (source, recorded_date, material_type, weight, weight_unit)
);

CREATE INDEX idx_history_source_recorded_date ON price_history (source, recorded_date);
