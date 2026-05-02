-- Hapus seluruh baris harga. Setelah ini, jalankan ulang isi migrations/turso/0001_create_price_history.sql
-- (mis. dari Turso SQL console, `turso db shell`, atau pipeline deploy Anda).
DROP TABLE IF EXISTS price_history;
