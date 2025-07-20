<!-- GitAds-Verify: 3FGPSI1T41Y2U29T9YLW1HH2VAPRXK9I -->

# Logam Mulia API

<p>Hobby only. Scraping beberapa website yang menyediakan informasi harga jual/beli logam mulia emas di Indonesia, dont worry to make pull request</p>

<pre>https://logam-mulia-api.vercel.app/</pre>

<h4>List website yang tersedia</h4>

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
[![Sponsored by GitAds](https://gitads.dev/v1/ad-serve?source=cacing69/logam-mulia-api@github)](https://gitads.dev/v1/ad-track?source=cacing69/logam-mulia-api@github)

Jika ingin menambahkan beberapa website lain, atau ada saran lain untuk bentuk response & requestnya, dipersilahkan untuk open issue terkait kritik dan saran


contoh response

`

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

`



parameter site boleh diisi salah satu dari beberapa website yang tersedia

- anekalogam : [https://logam-mulia-api.vercel.app/prices/anekalogam](https://logam-mulia-api.vercel.app/prices/anekalogam)
- logammulia : [https://logam-mulia-api.vercel.app/prices/logammulia](https://logam-mulia-api.vercel.app/prices/logammulia) (error : blocked by cloudflare)
- hargaemas-org : [https://logam-mulia-api.vercel.app/prices/hargaemas-org](https://logam-mulia-api.vercel.app/prices/hargaemas-org)
- lakuemas : [https://logam-mulia-api.vercel.app/prices/lakuemas](https://logam-mulia-api.vercel.app/prices/lakuemas)
- tokopedia : [https://logam-mulia-api.vercel.app/prices/tokopedia](https://logam-mulia-api.vercel.app/prices/tokopedia) (error : gateway timeout)
- pegadaian : [https://logam-mulia-api.vercel.app/prices/pegadaian](https://logam-mulia-api.vercel.app/prices/pegadaian)
- sakumas : [https://logam-mulia-api.vercel.app/prices/sakumas](https://logam-mulia-api.vercel.app/prices/sakumas)
- semar : [https://logam-mulia-api.vercel.app/prices/semar](https://logam-mulia-api.vercel.app/prices/semar)
- koinworks : [https://logam-mulia-api.vercel.app/prices/koinworks](https://logam-mulia-api.vercel.app/prices/koinworks)
- kursdolar : [https://logam-mulia-api.vercel.app/prices/kursdolar](https://logam-mulia-api.vercel.app/prices/kursdolar)
- cermati : [https://logam-mulia-api.vercel.app/prices/cermati](https://logam-mulia-api.vercel.app/prices/cermati)
- bsi : [https://logam-mulia-api.vercel.app/prices/bsi](https://logam-mulia-api.vercel.app/prices/bsi)
- brankaslm : [https://logam-mulia-api.vercel.app/prices/brankaslm](https://logam-mulia-api.vercel.app/prices/brankaslm)
- indogold : [https://logam-mulia-api.vercel.app/prices/indogold](https://logam-mulia-api.vercel.app/prices/indogold)
- hargaemas-net : [https://logam-mulia-api.vercel.app/prices/hargaemas-net](https://logam-mulia-api.vercel.app/prices/hargaemas-net)
- inbizia : [https://logam-mulia-api.vercel.app/prices/inbizia](https://logam-mulia-api.vercel.app/prices/inbizia)
- hargaemas-com : [https://logam-mulia-api.vercel.app/prices/hargaemas-com](https://logam-mulia-api.vercel.app/prices/hargaemas-com)
- treasury : [https://logam-mulia-api.vercel.app/prices/treasury](https://logam-mulia-api.vercel.app/prices/treasury)
