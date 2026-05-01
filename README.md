
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

- anekalogam: [https://logam-mulia-api.iamutaki.workers.dev/api/prices/anekalogam](https://logam-mulia-api.iamutaki.workers.dev/api/prices/anekalogam)
- hargaemas-org: [https://logam-mulia-api.iamutaki.workers.dev/api/prices/hargaemas-org](https://logam-mulia-api.iamutaki.workers.dev/api/prices/hargaemas-org)
- lakuemas: [https://logam-mulia-api.iamutaki.workers.dev/api/prices/lakuemas](https://logam-mulia-api.iamutaki.workers.dev/api/prices/lakuemas)
- sakumas: [https://logam-mulia-api.iamutaki.workers.dev/api/prices/sakumas](https://logam-mulia-api.iamutaki.workers.dev/api/prices/sakumas)
- kursdolar: [https://logam-mulia-api.iamutaki.workers.dev/api/prices/kursdolar](https://logam-mulia-api.iamutaki.workers.dev/api/prices/kursdolar)
- cermati: [https://logam-mulia-api.iamutaki.workers.dev/api/prices/cermati](https://logam-mulia-api.iamutaki.workers.dev/api/prices/cermati)
- indogold: [https://logam-mulia-api.iamutaki.workers.dev/api/prices/indogold](https://logam-mulia-api.iamutaki.workers.dev/api/prices/indogold)
- hargaemas-net: [https://logam-mulia-api.iamutaki.workers.dev/api/prices/hargaemas-net](https://logam-mulia-api.iamutaki.workers.dev/api/prices/hargaemas-net)
- treasury: [https://logam-mulia-api.iamutaki.workers.dev/api/prices/treasury](https://logam-mulia-api.iamutaki.workers.dev/api/prices/treasury)

## Progress Migration (On Progress)

Rewrite dan migrasi API sedang berjalan dari Vercel ke Cloudflare Worker.

Base URL Cloudflare Worker:

- [https://logam-mulia-api.iamutaki.workers.dev](https://logam-mulia-api.iamutaki.workers.dev)

## Alasan migrasi ke Cloudflare Worker

Deployment project ini di Vercel berstatus **paused** (tidak lagi melayani request), seperti tangkapan layar berikut. Karena itu API dipindahkan ke **Cloudflare Worker** supaya endpoint tetap aktif dan bisa diakses publik.

![Vercel deployment paused — alasan migrasi ke Cloudflare Worker](images/vercel_paused.png)

#### List website yang tersedia

- [Aneka Logam](https://www.anekalogam.co.id/id) `migrated`
- [Logam Mulia](https://www.logammulia.com/id) `paused: looking for solution`
- [Harga-Emas.org](https://harga-emas.org) `migrated`
- [Laku Emas](https://www.lakuemas.com/harga) `migrated`
- [Tokopedia](https://www.tokopedia.com/emas/harga-hari-ini/) `deprecated`
- [Pegadaian](https://www.pegadaian.co.id/harga) `paused: looking for solution`
- [Sakumas](https://sakumas.asastapayment.com/) `migrated`
- [Koin Works](https://koinworks.com/harga-emas-hari-ini/) `deprecated`
- [Semar Nusantara](https://goldprice.semar.co.id/home/multi/smg_press/smg) `paused: mapping response`
- [Kurs Dolar](http://kurs.dollar.web.id/harga-emas-hari-ini.php) `migrated`
- [Cermati](https://www.cermati.com/artikel/harga-emas-hari-ini) `migrated`
- [Bank Syariah Indonesia](https://www.bankbsi.co.id/) `paused: looking for solution`
- [Brankas](https://www.brankaslm.com/antam/index) `paused: looking for solution`
- [Indo Gold](https://www.indogold.id/) `migrated`
- [Harga-Emas.net](https://harga-emas.net/) `migrated`
- [inbizia](https://www.inbizia.com/harga-emas-hari-ini-287964) `deprecated`
- [Harga-Emas.com](https://www.hargaemas.com/) `migrated`
- [Treasury](https://treasury.id/) `migrated`

Jika ingin menambahkan beberapa website lain, atau ada saran lain untuk bentuk response & requestnya, dipersilahkan untuk open issue terkait kritik dan saran

contoh response

```json

{
  "data": [
    {
      "buy": 900000,
      "sell": 850000,
      "type": "antam"
    }
  ]
}

```
