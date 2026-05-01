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
	url: string;
	engine: 'cheerio';
	currency?: string;
	active?: boolean; // Flag untuk menonaktifkan scraper (default: true)
	method?: 'GET';
	responseType?: 'text';
	headers?: Record<string, string>;
	body?: unknown;
	// Single item selector (fallback when items is not defined)
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

export interface AxiosItemDefinition {
	url?: string;
	selector: AxiosSelectorDefinition;
}

export interface AxiosScrapingConfig {
	url: string;
	engine: 'axios';
	responseType?: 'json';
	method?: AxiosMethod;
	currency?: string;
	active?: boolean;
	headers?: Record<string, string>;
	body?: unknown;
	selector?: AxiosSelectorDefinition[];
	items?: AxiosItemDefinition[];
	postProcess?: ScrapingPostProcess;
}

export interface BaseScrapingConfig {
	url: string;
	engine: 'cheerio' | 'axios';
	currency?: string;
	active?: boolean;
	method?: AxiosMethod | 'GET';
	responseType?: 'text' | 'json';
	headers?: Record<string, string>;
	body?: unknown;
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
