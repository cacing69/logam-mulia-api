# Logam Mulia API
<p>Hobby only. Scraping beberapa website yang menyediakan informasi harga jual/beli logam mulia emas di Indonesia, dont worry to make pull request</p>

<pre>https://logam-mulia-api.vercel.app/</pre>
<h4>List website yang tersedia</h4>
1. [Aneka Logam](https://www.anekalogam.co.id/id)
2. [Logam Mulia](https://www.logammulia.com/id)

Jika ingin menambahkan beberapa website lain, dipersilahkan untuk open issue terkait kritik dan saran

<p>Mengambil harga jual dan beli</p>
GET https://logam-mulia-api.vercel.app/prices?site=siteName

contoh response
`
{
    data: {
        rate: {
            sell: 882000,
            buy: 895000,
            type: "antam"
        }
    },
    meta: {
            engine: "playwright-aws-lambda",
            site: {
            url: "https://www.anekalogam.co.id/id"
        }
    }
}
`

parameter site boleh diisi salah satu dari beberapa website yang tersedia
1.(anekalogam)[https://logam-mulia-api.vercel.app/prices?site=anekalogam]
2.(logammulia)[https://logam-mulia-api.vercel.app/prices?site=logammulia]
