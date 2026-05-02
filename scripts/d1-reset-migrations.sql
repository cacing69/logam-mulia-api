-- Hapus data + jejak migrasi D1 agar `wrangler d1 migrations apply` menjalankan ulang semua file di migrations/d1/.
DROP TABLE IF EXISTS price_history;
DROP TABLE IF EXISTS d1_migrations;
