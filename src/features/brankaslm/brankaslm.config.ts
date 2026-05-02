import type { JinaMarkdownLabelPriceConfig } from '../../lib/scrapers/jina-markdown-label-scrape';

/** Baris "terakhir diperbarui" di markdown Jina; grup 1 = teks info. */
export const brankaslmInfoPattern = /Terakhir diperbarui\s*:\s*(.+)/i;

/** Nominal dari teks "Harga Beli Emas Fisik … Rp …" → disimpan sebagai {@link JinaMarkdownLabelRowResult.sellPrice}. */
export const brankaslmFisikSellPriceRe =
	/Harga Beli Emas Fisik\s*(?:\n\s*)?(?:\*\*)?Rp\s*([\d.,]+)/i;

/** Nominal dari teks "Harga Beli Emas BRANKAS Korporat … Rp …" → {@link JinaMarkdownLabelRowResult.sellPrice}. */
export const brankaslmKorporatSellPriceRe =
	/Harga Beli Emas BRANKAS Korporat\s*(?:\n\s*)?(?:\*\*)?Rp\s*([\d.,]+)/i;

export const brankaslmConfig: JinaMarkdownLabelPriceConfig = {
	name: 'brankaslm',
	url: 'https://brankaslm.com/dashboard',
	currency: 'IDR',
	active: true,
	infoPattern: brankaslmInfoPattern,
	items: [
		{
			weight: 1,
			weightUnit: 'gr',
			materialType: 'Emas Fisik',
			material: 'gold',
			sellPriceRegex: brankaslmFisikSellPriceRe,
		},
		{
			weight: 1,
			weightUnit: 'gr',
			materialType: 'Emas BRANKAS Korporat',
			material: 'gold',
			sellPriceRegex: brankaslmKorporatSellPriceRe,
		},
	],
};
