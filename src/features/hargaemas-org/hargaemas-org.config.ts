import type { ScrapingConfig } from '../../lib/types/scraper.types';

export const hargaemasOrgConfig: ScrapingConfig<'sellPrice'> = {
	name: 'hargaemas-org',
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://harga-emas.org/1-gram',
	active: true,
	items: [
		{
			selector: {
				sellPrice:
					'body > main > div.layout_footer-buy-sell-wrapper__8es4r > div > div.layout_content__49Kn9 > div.layout_light-text__rQYRl',
			},
			postProcess: (rawData) => {
				const [buybackPrice = '', sellPrice = ''] = (rawData.sellPrice ?? '').split('|').map((v) => v.trim());

				return {
					buybackPrice,
					sellPrice,
				};
			},
		},
	],
};
