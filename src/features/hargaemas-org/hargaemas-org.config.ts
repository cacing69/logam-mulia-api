import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const hargaemasOrgConfig: ScrapingConfig<'price' | 'type' | 'info'> = {
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://harga-emas.org/1-gram',
	active: true,
	items: [
		{
			selector: {
				price:
					'body > main > div.layout_footer-buy-sell-wrapper__8es4r > div > div.layout_content__49Kn9 > div.layout_light-text__rQYRl',
				type: raw('pluang'),
				info: 'title',
			},
			postProcess: (rawData) => {
				const [sell = '', buy = ''] = (rawData.price ?? '').split('|').map((v) => v.trim());

				return {
					sell,
					buy,
					type: rawData.type ?? '',
					info: rawData.info ?? '',
				};
			},
		},
	],
};
