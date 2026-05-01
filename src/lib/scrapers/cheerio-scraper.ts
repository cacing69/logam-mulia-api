import * as cheerio from 'cheerio';
import type {
	ScrapingConfig,
	ScrapingResult,
	ScrapingOptions,
	RawValue,
	ScrapingPostProcess,
} from '../types/scraper.types';

export class CheerioScraper<T extends Record<string, string> = Record<string, string>> {
	private config: ScrapingConfig<string>;
	private source: string;

	constructor(source: string, config: ScrapingConfig<string>) {
		this.source = source;
		this.config = config;
	}

	private isRawValue(value: unknown): value is RawValue {
		return typeof value === 'object' && value !== null && '__raw' in value;
	}

	private async fetchHtml(url: string, options?: ScrapingOptions): Promise<cheerio.CheerioAPI> {
		const maxAttempts = (options?.retries ?? 0) + 1;
		let lastError: Error | null = null;

		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), options?.timeout ?? 10000);

			try {
				const response = await fetch(url, {
					signal: controller.signal,
					headers: options?.headers,
				});

				if (!response.ok) {
					const body = await response.text();
					const bodySnippet = body.slice(0, 180).replace(/\s+/g, ' ').trim();
					const errorMessage = bodySnippet
						? `HTTP ${response.status}: ${response.statusText} - ${bodySnippet}`
						: `HTTP ${response.status}: ${response.statusText}`;

					// Retry on transient server/network-side failures.
					if (response.status >= 500 && attempt < maxAttempts) {
						lastError = new Error(errorMessage);
						continue;
					}

					throw new Error(errorMessage);
				}

				const html = await response.text();
				return cheerio.load(html);
			} catch (error) {
				lastError = error instanceof Error ? error : new Error('Unknown fetch error');
				if (attempt < maxAttempts) {
					continue;
				}
				throw lastError;
			} finally {
				clearTimeout(timeoutId);
			}
		}

		throw lastError ?? new Error('Unknown fetch error');
	}

	private async scrapeItem(
		url: string,
		selector: Record<string, string | RawValue>,
		postProcess?: ScrapingPostProcess,
		transformer?: (data: Record<string, string>) => Record<string, string>,
		options?: ScrapingOptions
	): Promise<Record<string, string> | null> {
		try {
			const $ = await this.fetchHtml(url, options);
			const rawData: Record<string, string> = {};

			for (const [key, selValue] of Object.entries(selector)) {
				if (this.isRawValue(selValue)) {
					rawData[key] = selValue.__raw;
				} else {
					rawData[key] = $(selValue).text().trim();
				}
			}

			const processedData = postProcess ? postProcess(rawData) : rawData;
			return transformer ? transformer(processedData) : processedData;
		} catch (error) {
			throw error; // Re-throw to handle at higher level
		}
	}

	async scrape<TOutput = T>(
		transformer?: (data: Record<string, string>) => TOutput,
		options?: ScrapingOptions
	): Promise<ScrapingResult<TOutput>> {
		const timestamp = new Date().toISOString();

		// Check if scraper is inactive
		if (this.config.active === false) {
			return {
				success: false,
				error: 'inactive',
				timestamp,
				source: this.source,
				currency: this.config.currency,
				inactive: true,
			};
		}

		// Single item (legacy)
		if (this.config.selector && this.config.url) {
			try {
				const result = await this.scrapeItem(
					this.config.url,
					this.config.selector,
					this.config.postProcess,
					transformer as (data: Record<string, string>) => Record<string, string>,
					options
				);

				if (!result) {
					throw new Error('Failed to scrape data');
				}

				return {
					success: true,
					data: (result as unknown) as TOutput,
					timestamp,
					source: this.source,
					currency: this.config.currency,
				};
			} catch (error) {
				return {
					success: false,
					error: error instanceof Error ? error.message : 'Unknown error',
					timestamp,
					source: this.source,
					currency: this.config.currency,
				};
			}
		}

		// Multiple items dengan URL berbeda
		if (this.config.items) {
			const items: TOutput[] = [];
			const errors: string[] = [];

			for (const itemDef of this.config.items) {
				try {
					const result = await this.scrapeItem(
						itemDef.url,
						itemDef.selector,
						itemDef.postProcess,
						transformer as (data: Record<string, string>) => Record<string, string>,
						options
					);

					if (result) {
						items.push((result as unknown) as TOutput);
					}
				} catch (error) {
					const errMsg = error instanceof Error ? error.message : 'Unknown error';
					errors.push(`${itemDef.url}: ${errMsg}`);
				}
			}

			// If all items failed, return error
			if (items.length === 0 && errors.length > 0) {
				return {
					success: false,
					error: `All items failed: ${errors.join('; ')}`,
					timestamp,
					source: this.source,
					currency: this.config.currency,
				};
			}

			return {
				success: true,
				data: items,
				count: items.length,
				timestamp,
				source: this.source,
				currency: this.config.currency,
			};
		}

		return {
			success: false,
			error: 'No selector or items defined in config.',
			timestamp,
			source: this.source,
			currency: this.config.currency,
		};
	}
}
