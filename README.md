
# Logam Mulia API

<p>Hobby only. Scraping beberapa website yang menyediakan informasi harga jual/beli logam mulia emas di Indonesia, dont worry to make pull request</p>



<pre>https://logam-mulia-api.vercel.app/</pre>

<h4>List website yang tersedia</h4>

- [Aneka Logam](https://www.anekalogam.co.id/id)
- [Logam Mulia](https://www.logammulia.com/id)
- [Harga Emas](https://harga-emas.org)
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

Jika ingin menambahkan beberapa website lain, dipersilahkan untuk open issue terkait kritik dan saran



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
- logammulia : [https://logam-mulia-api.vercel.app/prices/logammulia](https://logam-mulia-api.vercel.app/prices/logammulia)
- hargaemas : [https://logam-mulia-api.vercel.app/prices/hargaemas](https://logam-mulia-api.vercel.app/prices/hargaemas)
- lakuemas : [https://logam-mulia-api.vercel.app/prices/lakuemas](https://logam-mulia-api.vercel.app/prices/lakuemas)
- tokopedia : [https://logam-mulia-api.vercel.app/prices/tokopedia](https://logam-mulia-api.vercel.app/prices/tokopedia)
- pegadaian : [https://logam-mulia-api.vercel.app/prices/pegadaian](https://logam-mulia-api.vercel.app/prices/pegadaian)
- sakumas : [https://logam-mulia-api.vercel.app/prices/sakumas](https://logam-mulia-api.vercel.app/prices/sakumas)
- semar : [https://logam-mulia-api.vercel.app/prices/semar](https://logam-mulia-api.vercel.app/prices/semar)
- koinworks : [https://logam-mulia-api.vercel.app/prices/koinworks](https://logam-mulia-api.vercel.app/prices/koinworks)
- kursdolar : [https://logam-mulia-api.vercel.app/prices/kursdolar](https://logam-mulia-api.vercel.app/prices/kursdolar)
- cermati : [https://logam-mulia-api.vercel.app/prices/cermati](https://logam-mulia-api.vercel.app/prices/cermati)
- bsi : [https://logam-mulia-api.vercel.app/prices/bsi](https://logam-mulia-api.vercel.app/prices/bsi)
- brankaslm : [https://logam-mulia-api.vercel.app/prices/brankaslm](https://logam-mulia-api.vercel.app/prices/brankaslm)
