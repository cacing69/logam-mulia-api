import { raw, type ScrapingConfig } from '../../lib/types';

const CONTAINER_GALERI_24 = '#GALERI\\ 24 > div > div[class*="overflow-x-scroll"][class*="overflow-visible"] > div';
const CONTAINER_DINAR_G_24 = '#DINAR\\ G24 > div > div[class*="overflow-x-scroll"][class*="overflow-visible"] > div';
const CONTAINER_BABY_GALERI_24 = '#BABY\\ GALERI\\ G24 > div > div[class*="overflow-x-scroll"][class*="overflow-visible"] > div';
const CONTAINER_ANTAM = '#ANTAM > div > div[class*="overflow-x-scroll"][class*="overflow-visible"] > div';
const CONTAINER_UBS = '#UBS > div > div[class*="overflow-x-scroll"][class*="overflow-visible"] > div';
const CONTAINER_ANTAM_MULIA_RETRO = '#ANTAM\\ MULIA\\ RETRO > div > div[class*="overflow-x-scroll"][class*="overflow-visible"] > div';
const CONTAINER_ANTAM_NON_PEGADAIAN = '#ANTAM\\ NON\\ PEGADAIAN > div > div[class*="overflow-x-scroll"][class*="overflow-visible"] > div';
const CONTAINER_LOTUS_ARCHI = '#LOTUS\\ ARCHI > div > div[class*="overflow-x-scroll"][class*="overflow-visible"] > div';
const CONTAINER_UBS_DISNEY = '#UBS\\ DISNEY > div > div[class*="overflow-x-scroll"][class*="overflow-visible"] > div';
const CONTAINER_UBS_ELSA = '#UBS\\ ELSA > div > div[class*="overflow-x-scroll"][class*="overflow-visible"] > div';
const CONTAINER_UBS_ANNA = '#UBS\\ ANNA > div > div[class*="overflow-x-scroll"][class*="overflow-visible"] > div';
const CONTAINER_UBS_MICKEY_FULLBODY = '#UBS\\ MICKEY\\ FULLBODY > div > div[class*="overflow-x-scroll"][class*="overflow-visible"] > div';
const CONTAINER_LOTUS_ARCHI_GIFT = '#LOTUS\\ ARCHI\\ GIFT > div > div[class*="overflow-x-scroll"][class*="overflow-visible"] > div';
const CONTAINER_UBS_HELLO_KITTY = '#UBS\\ HELLO\\ KITTY > div > div[class*="overflow-x-scroll"][class*="overflow-visible"] > div';
const CONTAINER_BABY_SERIES_TUMBUHAN = '#BABY\\ SERIES\\ TUMBUHAN > div > div[class*="overflow-x-scroll"][class*="overflow-visible"] > div';
const CONTAINER_BABY_SERIES_INVESTASI = '#BABY\\ SERIES\\ INVESTASI > div > div[class*="overflow-x-scroll"][class*="overflow-visible"] > div';
const CONTAINER_BATIK_SERIES = '#BATIK\\ SERIES > div > div[class*="overflow-x-scroll"][class*="overflow-visible"] > div';
const CONTAINER_SENTRA_BUYBACK = '#SENTRA\\ BUYBACK > div > div[class*="overflow-x-scroll"][class*="overflow-visible"] > div';

function postProcessRow(rawData: Record<string, string>) {
	return { ...rawData };
}

function makeItem(baseContainer: string, row: number, materialType: string) {
	return {
		selector: {
			weight: `${baseContainer} > div:nth-child(${row}) > div:nth-child(1)`,
			sellPrice: `${baseContainer} > div:nth-child(${row}) > div:nth-child(2)`,
			buybackPrice: `${baseContainer} > div:nth-child(${row}) > div:nth-child(3)`,
			material: raw('gold'),
			materialType: raw(materialType),
			weightUnit: raw('gr'),
		},
		postProcess: postProcessRow,
	};
}

export const galeri24Config: ScrapingConfig<'sellPrice' | 'buybackPrice'> = {
	name: 'galeri24',
	displayName: 'Galeri 24',
	logo: '',
	urlHomepage: 'https://galeri24.co.id',
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://galeri24.co.id/harga-emas',
	active: true,
	items: [
		...Array.from({ length: 11 }, (_, i) => makeItem(CONTAINER_GALERI_24, i + 2, `GALERI 24`)),
		...Array.from({ length: 3 }, (_, i) => makeItem(CONTAINER_DINAR_G_24, i + 2, `DINAR G24`)),
		...Array.from({ length: 9 }, (_, i) => makeItem(CONTAINER_BABY_GALERI_24, i + 2, `BABY GALERI G24`)),
		...Array.from({ length: 12 }, (_, i) => makeItem(CONTAINER_ANTAM, i + 2, `ANTAM`)),
		...Array.from({ length: 10 }, (_, i) => makeItem(CONTAINER_UBS, i + 2, `UBS`)),
		...Array.from({ length: 10 }, (_, i) => makeItem(CONTAINER_ANTAM_MULIA_RETRO, i + 2, `ANTAM MULIA RETRO`)),
		...Array.from({ length: 9 }, (_, i) => makeItem(CONTAINER_ANTAM_NON_PEGADAIAN, i + 2, `ANTAM NON PEGADAIAN`)),
		...Array.from({ length: 6 }, (_, i) => makeItem(CONTAINER_LOTUS_ARCHI, i + 2, `LOTUS ARCHI`)),
		...Array.from({ length: 5 }, (_, i) => makeItem(CONTAINER_UBS_DISNEY, i + 2, `UBS DISNEY`)),
		...Array.from({ length: 3 }, (_, i) => makeItem(CONTAINER_UBS_ELSA, i + 2, `UBS ELSA`)),
		...Array.from({ length: 3 }, (_, i) => makeItem(CONTAINER_UBS_ANNA, i + 2, `UBS ANNA`)),
		...Array.from({ length: 3 }, (_, i) => makeItem(CONTAINER_UBS_MICKEY_FULLBODY, i + 2, `UBS MICKEY FULLBODY`)),
		...Array.from({ length: 2 }, (_, i) => makeItem(CONTAINER_LOTUS_ARCHI_GIFT, i + 2, `LOTUS ARCHI GIFT`)),
		...Array.from({ length: 1 }, (_, i) => makeItem(CONTAINER_UBS_HELLO_KITTY, i + 2, `UBS HELLO KITTY`)),
		...Array.from({ length: 1 }, (_, i) => makeItem(CONTAINER_BABY_SERIES_TUMBUHAN, i + 2, `BABY SERIES TUMBUHAN`)),
		...Array.from({ length: 1 }, (_, i) => makeItem(CONTAINER_BABY_SERIES_INVESTASI, i + 2, `BABY SERIES INVESTASI`)),
		...Array.from({ length: 10 }, (_, i) => makeItem(CONTAINER_BATIK_SERIES, i + 2, `BATIK SERIES`)),
		...Array.from({ length: 12 }, (_, i) => makeItem(CONTAINER_SENTRA_BUYBACK, i + 2, `SENTRA BUYBACK`)),
	],
};
