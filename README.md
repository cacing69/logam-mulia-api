
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

## GitAds Sponsored

[Sponsored by GitAds](https://gitads.dev/v1/ad-track?source=cacing69/logam-mulia-api@github)

## Endpoint Available Saat Ini (Cloudflare Worker)

| Source | Endpoint | History Endpoint | Cached | History |
|--------|----------|------------------|--------|---------|
| anekalogam | [`/api/prices/anekalogam`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/anekalogam) | [`/api/prices/anekalogam/history`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/anekalogam/history) | ✅ | ✅ |
| hargaemas-org | [`/api/prices/hargaemas-org`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/hargaemas-org) | - | ❌ | ❌ |
| lakuemas | [`/api/prices/lakuemas`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/lakuemas) | - | ❌ | ❌ |
| sakumas | [`/api/prices/sakumas`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/sakumas) | - | ❌ | ❌ |
| kursdolar | [`/api/prices/kursdolar`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/kursdolar) | - | ❌ | ❌ |
| cermati | [`/api/prices/cermati`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/cermati) | - | ❌ | ❌ |
| indogold | [`/api/prices/indogold`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/indogold) | - | ❌ | ❌ |
| hargaemas-net | [`/api/prices/hargaemas-net`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/hargaemas-net) | - | ❌ | ❌ |
| hargaemas-com | [`/api/prices/hargaemas-com`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/hargaemas-com) | - | ❌ | ❌ |
| treasury | [`/api/prices/treasury`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/treasury) | - | ❌ | ❌ |
| logammulia | [`/api/prices/logammulia`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/logammulia) | - | ❌ | ❌ |
| emasku | [`/api/prices/emasku`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/emasku) | - | ❌ | ❌ |
| hartadinataabadi | [`/api/prices/hartadinataabadi`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/hartadinataabadi) | - | ❌ | ❌ |
| galeri24 | [`/api/prices/galeri24`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/galeri24) | - | ❌ | ❌ |
| sampoernagold | [`/api/prices/sampoernagold`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/sampoernagold) | - | ❌ | ❌ |
| bankbsi | [`/api/prices/bankbsi`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/bankbsi) | - | ❌ | ❌ |
| brankaslm | [`/api/prices/brankaslm`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/brankaslm) | - | ❌ | ❌ |
| pegadaian | [`/api/prices/pegadaian`](https://logam-mulia-api.iamutaki.workers.dev/api/prices/pegadaian) | - | ❌ | ❌ |

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

#### List website yang tersedia

| No | Nama | URL | Status |
|----|------|-----|--------|
| 1 | Aneka Logam | [link](https://www.anekalogam.co.id/id) | migrated |
| 2 | Logam Mulia | [link](https://www.logammulia.com/id) | migrated |
| 3 | Harga-Emas.org | [link](https://harga-emas.org) | migrated |
| 4 | Laku Emas | [link](https://www.lakuemas.com/harga) | migrated |
| 5 | Tokopedia | [link](https://www.tokopedia.com/emas/harga-hari-ini/) | deprecated |
| 6 | Pegadaian | [link](https://sahabat.pegadaian.co.id/harga-emas) | migrated |
| 7 | Sakumas | [link](https://sakumas.asastapayment.com/) | migrated |
| 8 | Koin Works | [link](https://koinworks.com/harga-emas-hari-ini/) | deprecated |
| 9 | Semar Nusantara | [link](https://goldprice.semar.co.id/home/multi/smg_press/smg) | paused: mapping response |
| 10 | Kurs Dolar | [link](http://kurs.dollar.web.id/harga-emas-hari-ini.php) | migrated |
| 11 | Cermati | [link](https://www.cermati.com/artikel/harga-emas-hari-ini) | migrated |
| 12 | Bank Syariah Indonesia | [link](https://www.bankbsi.co.id/) | migrated |
| 13 | Brankas Logam Mulia | [link](https://www.brankaslm.com/dashboard) | migrated |
| 14 | Indo Gold | [link](https://www.indogold.id/) | migrated |
| 15 | Harga-Emas.net | [link](https://harga-emas.net/) | migrated |
| 16 | inbizia | [link](https://www.inbizia.com/harga-emas-hari-ini-287964) | deprecated |
| 17 | Harga-Emas.com | [link](https://www.hargaemas.com/) | migrated |
| 18 | Treasury | [link](https://treasury.id/) | migrated |
| 19 | EmasKu | [link](https://www.emasku.co.id/id) | new |
| 20 | Hartadinata Abadi | [link](https://hartadinataabadi.co.id/) | new |
| 21 | Galeri 24 | [link](https://galeri24.co.id/harga-emas) | new |
| 22 | Sampoerna Gold | [link](https://sampoernagold.com/) | new |

Jika ingin menambahkan beberapa website lain, atau ada saran lain untuk bentuk response & requestnya, dipersilahkan untuk open issue terkait kritik dan saran

contoh response

```json

{
  "data": [
    {
      "price": 900000,
      "buybackPrice": 850000,
      "type": "antam"
    }
  ]
}

```
