

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

## Endpoint Available Saat Ini (Cloudflare Worker)

1. anekalogam: [https://logam-mulia-api.iamutaki.workers.dev/api/prices/anekalogam](https://logam-mulia-api.iamutaki.workers.dev/api/prices/anekalogam)

## Progress Migration (On Progress)

Rewrite dan migrasi API sedang berjalan dari Vercel ke Cloudflare Worker.

Base URL Cloudflare Worker:

- [https://logam-mulia-api.iamutaki.workers.dev](https://logam-mulia-api.iamutaki.workers.dev)

#### List website yang tersedia

- [Aneka Logam](https://www.anekalogam.co.id/id)
- [Logam Mulia](https://www.logammulia.com/id)
- [Harga-Emas.org](https://harga-emas.org)
- [Laku Emas](https://www.lakuemas.com/harga)
- [Tokopedia](https://www.tokopedia.com/emas/harga-hari-ini/)
- [Pegadaian](https://www.pegadaian.co.id/harga)
- [Sakumas](https://sakumas.com/)
- [Koin Works](https://koinworks.com/harga-emas-hari-ini/)
- [Semar Nusantara](https://goldprice.semar.co.id/home/multi/smg_press/smg)
- [Kurs Dolar](http://kurs.dollar.web.id/harga-emas-hari-ini.php)
- [Cermati](https://www.cermati.com/artikel/harga-emas-hari-ini)
- [Bank Syariah Indonesia](https://www.bankbsi.co.id/)
- [Brankas](https://www.brankaslm.com/antam/index)
- [Indo Gold](https://www.brankaslm.com/antam/index)
- [Harga-Emas.net](https://harga-emas.net/)
- [inbizia](https://www.inbizia.com/harga-emas-hari-ini-287964)
- [Harga-Emas.com](https://www.hargaemas.com/)
- [Treasury](https://treasury.id/)

## GitAds Sponsored

[Sponsored by GitAds](https://gitads.dev/v1/ad-track?source=cacing69/logam-mulia-api@github)

Jika ingin menambahkan beberapa website lain, atau ada saran lain untuk bentuk response & requestnya, dipersilahkan untuk open issue terkait kritik dan saran

contoh response

```json

{
  data: [
    {
      buy: 900000,
      sel: 850000,
      type: "antam",
    }
  ],
  meta: {}
}

```
