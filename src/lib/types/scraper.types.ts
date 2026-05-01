export interface RawValue {
	__raw: string;
}

export function raw(value: string | null): RawValue {
	return { __raw: value ?? '' };
}

export type ScrapingPostProcess = (data: Record<string, string>) => Record<string, string>;

export interface ItemDefinition<T extends string = string> {
	url?: string; // Optional: fallback ke config.url jika tidak diisi
	selector: Record<T, string | RawValue>;
	postProcess?: ScrapingPostProcess;
}

export interface CheerioScrapingConfig<T extends string = string> {
	url?: string; // Default/base URL (deprecated, use items with url)
	engine: 'cheerio';
	currency?: string;
	active?: boolean; // Flag untuk menonaktifkan scraper (default: true)
	// Single item (deprecated, use items)
	selector?: Record<T, string | RawValue>;
	postProcess?: ScrapingPostProcess;
	// Multiple items dengan URL masing-masing
	items?: ItemDefinition<T>[];
}

export type AxiosMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface AxiosSelectorDefinition {
	type: string;
	buy?: string;
	sell?: string;
	info?: string;
	weight?: number;
	unit?: string;
	[key: string]: string | number | undefined;
}

export interface AxiosScrapingConfig {
	url: string;
	engine: 'axios';
	responseType?: 'json';
	method?: AxiosMethod;
	currency?: string;
	active?: boolean;
	selector: AxiosSelectorDefinition[];
	body?: unknown;
	headers?: Record<string, string>;
}

export type ScrapingConfig<T extends string = string> = CheerioScrapingConfig<T>;
export type AnyScrapingConfig<T extends string = string> =
	| CheerioScrapingConfig<T>
	| AxiosScrapingConfig;

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
	retries?: number;
}
