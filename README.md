
# Logam Mulia API

Hobby only. Scraping beberapa website yang menyediakan informasi harga jual/beli logam mulia emas di Indonesia, dont worry to make pull request

```bash
# inactive
https://logam-mulia-api.vercel.app/
```

```bash
# active
https://logam-mulia-api.iamutaki.workers.dev/
```
contoh response

```json

{
  "data": [
    {
      "sellPrice": 900000,
      "buybackPrice": 850000,
      "materialType": "antam",
      "weight": 1,
      "weightUnit": "gr"
    }
  ]
}

```

## GitAds Sponsored

[![Sponsored by GitAds](https://gitads.dev/v1/ad-serve?source=cacing69/logam-mulia-api@github)](https://gitads.dev/v1/ad-track?source=cacing69/logam-mulia-api@github)

## Endpoint Available Saat Ini (Cloudflare Worker)

| Source | Status | Endpoint | History Endpoint | Cached |
| ------ | ------ | -------- | ---------------- | ------ |
| anekalogam | ✅ | [`/anekalogam`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/anekalogam) | [`/anekalogam/history`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/anekalogam/history) | ✅ |
| hargaemas-org | ✅ | [`/hargaemas-org`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/hargaemas-org) | - | ❌ |
| lakuemas | ✅ | [`/lakuemas`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/lakuemas) | - | ❌ |
| sakumas | ✅ | [`/sakumas`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/sakumas) | - | ❌ |
| kursdolar | ✅ | [`/kursdolar`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/kursdolar) | - | ❌ |
| cermati | ✅ | [`/cermati`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/cermati) | [`/cermati/history`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/cermati/history) | ✅ |
| indogold | ✅ | [`/indogold`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/indogold) | - | ❌ |
| hargaemas-net | ✅ | [`/hargaemas-net`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/hargaemas-net) | - | ❌ |
| hargaemas-com | ✅ | [`/hargaemas-com`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/hargaemas-com) | - | ❌ |
| treasury | ✅ | [`/treasury`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/treasury) | - | ❌ |
| logammulia | ✅ | [`/logammulia`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/logammulia) | - | ❌ |
| emasku | ✅ | [`/emasku`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/emasku) | [`/emasku/history`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/emasku/history) | ✅ |
| hartadinataabadi | ✅ | [`/hartadinataabadi`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/hartadinataabadi) | - | ❌ |
| galeri24 | ✅ | [`/galeri24`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/galeri24) | [`/galeri24/history`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/galeri24/history) | ✅ |
| sampoernagold | ✅ | [`/sampoernagold`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/sampoernagold) | - | ❌ |
| bankbsi | ✅ | [`/bankbsi`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/bankbsi) | [`/bankbsi/history`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/bankbsi/history) | ✅ |
| brankaslm | ✅ | [`/brankaslm`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/brankaslm) | [`/brankaslm/history`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/brankaslm/history) | ✅ |
| pegadaian | ✅ | [`/pegadaian`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/pegadaian) | - | ❌ |

## Available params on history

| Param | Type | Notes |
| ----- | ---- | ----- |
| page | int | Pagination page number |
| length | int | Pagination length (max 1000) |
| weight | int | Filter by weight |

```bash
# Endpoint (latest price)
curl -X GET "https://logam-mulia-api.iamutaki.workers.dev/api/prices/anekalogam"
```

```bash
# Endpoint (force refresh / skip cache)
curl -X GET "https://logam-mulia-api.iamutaki.workers.dev/api/prices/anekalogam?refresh=true"
```

```bash
# History (default pagination: page=1, length=20)
curl -X GET "https://logam-mulia-api.iamutaki.workers.dev/api/prices/anekalogam/history"
```

```bash
# History with pagination
curl -X GET "https://logam-mulia-api.iamutaki.workers.dev/api/prices/anekalogam/history?page=1&length=20"
```

```bash
# History with weight filter
curl -X GET "https://logam-mulia-api.iamutaki.workers.dev/api/prices/anekalogam/history?weight=10"
```

Keterangan:

- `Daily Cached` menggunakan Cloudflare D1
- `History` menggunakan Turso
- Akses D1: [Cloudflare Dashboard - D1](https://developers.cloudflare.com/d1/get-started/)
- Akses Turso: [Turso Dashboard](https://app.turso.tech/)

## Progress Migration (On Progress)

Rewrite dan migrasi API sedang berjalan dari Vercel ke Cloudflare Worker.

Base URL Cloudflare Worker:

- [https://logam-mulia-api.iamutaki.workers.dev](https://logam-mulia-api.iamutaki.workers.dev)

## Alasan migrasi ke Cloudflare Worker

Deployment project ini di Vercel berstatus **paused** (tidak lagi melayani request), seperti tangkapan layar berikut. Karena itu API dipindahkan ke **Cloudflare Worker** supaya endpoint tetap aktif dan bisa diakses publik.

![Vercel deployment paused — alasan migrasi ke Cloudflare Worker](images/vercel_paused.png)

### List website yang tersedia

| No | URL | Status |
| -- | --- | ------ |
| 1 | [Aneka Logam](https://www.anekalogam.co.id/id) | migrated |
| 2 | [Logam Mulia](https://www.logammulia.com/id) | migrated |
| 3 | [Harga-Emas.org](https://harga-emas.org) | migrated |
| 4 | [Laku Emas](https://www.lakuemas.com/harga) | migrated |
| 5 | [Tokopedia Emas](https://www.tokopedia.com/emas/harga-hari-ini/) | deprecated |
| 6 | [Pegadaian](https://sahabat.pegadaian.co.id/harga-emas) | migrated |
| 7 | [Sakumas](https://sakumas.asastapayment.com/) | migrated |
| 8 | [Koin Works](https://koinworks.com/harga-emas-hari-ini/) | deprecated |
| 9 | [Semar Nusantara](https://goldprice.semar.co.id/home/multi/smg_press/smg) | paused: mapping response |
| 10 | [Kurs Dolar](http://kurs.dollar.web.id/harga-emas-hari-ini.php) | migrated |
| 11 | [Cermati](https://www.cermati.com/artikel/harga-emas-hari-ini) | migrated |
| 12 | [Bank Syariah Indonesia](https://www.bankbsi.co.id/) | migrated |
| 13 | [Brankas Logam Mulia](https://www.brankaslm.com/dashboard) | migrated |
| 14 | [Indo Gold](https://www.indogold.id/) | migrated |
| 15 | [Harga-Emas.net](https://harga-emas.net/) | migrated |
| 16 | [inbizia](https://www.inbizia.com/harga-emas-hari-ini-287964) | deprecated |
| 17 | [Harga-Emas.com](https://www.hargaemas.com/) | migrated |
| 18 | [Treasury](https://treasury.id/) | migrated |
| 19 | [EmasKu](https://www.emasku.co.id/id/gold-price) | migrated |
| 20 | [Hartadinata Abadi](https://hartadinataabadi.co.id/) | new |
| 21 | [Galeri 24](https://galeri24.co.id/harga-emas) | new |
| 22 | [Sampoerna Gold](https://sampoernagold.com/) | new |

Jika ada referensi website harga emas lain, silakan tambahkan komentar disini : [List of websites that can be scraped for data #10](https://github.com/cacing69/logam-mulia-api/issues/10).

Kalau ada tambahan listing, saran, atau kontribusi lain, bisa disampaikan via [Issue](https://github.com/cacing69/logam-mulia-api/issues).
