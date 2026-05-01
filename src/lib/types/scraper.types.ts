export interface RawValue {
	__raw: string;
}

export function raw(value: string): RawValue {
	return { __raw: value };
}

export interface ItemDefinition<T extends string = string> {
	url: string; // Setiap item punya URL sendiri
	selector: Record<T, string | RawValue>;
}

export interface ScrapingConfig<T extends string = string> {
	url?: string; // Default/base URL (deprecated, use items with url)
	engine: 'cheerio';
	currency?: string;
	active?: boolean; // Flag untuk menonaktifkan scraper (default: true)
	// Single item (deprecated, use items)
	selector?: Record<T, string | RawValue>;
	// Multiple items dengan URL masing-masing
	items?: ItemDefinition<T>[];
}

export interface ScrapingResult<T = unknown> {
	success: boolean;
	data?: T | T[];
	error?: string;
	timestamp: string;
	source: string;
	currency?: string;
	count?: number;
	inactive?: boolean; // Flag jika scraper dinonaktifkan
}

export interface ScrapingOptions {
	timeout?: number;
	headers?: Record<string, string>;
}
