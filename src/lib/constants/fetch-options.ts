import type { FetchOptions } from '../types/scraper.types';

export const defaultFetchOptions: FetchOptions = {
	headers: {
		'User-Agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
		Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
		'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
	},
	timeout: 15000,
	retries: 2,
};

/** @deprecated Use defaultFetchOptions */ export const defaultScrapingOptions = defaultFetchOptions;
