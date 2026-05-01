import type {
	AxiosScrapingConfig,
	AxiosItemDefinition,
	AxiosSelectorDefinition,
	ScrapingOptions,
	ScrapingResult,
} from '../types/scraper.types';

function getByPath(obj: unknown, path: string): unknown {
	if (!path) {
		return undefined;
	}

	return path.split('.').reduce<unknown>((acc, key) => {
		if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
			return (acc as Record<string, unknown>)[key];
		}
		return undefined;
	}, obj);
}

function toStringValue(value: unknown): string {
	if (value === null || value === undefined) {
		return '';
	}
	return String(value);
}

export class AxiosScraper<T extends Record<string, string> = Record<string, string>> {
	private config: AxiosScrapingConfig;
	private source: string;

	constructor(source: string, config: AxiosScrapingConfig) {
		this.source = source;
		this.config = config;
	}

	private async fetchJson(url: string, options?: ScrapingOptions): Promise<unknown> {
		const maxAttempts = (options?.retries ?? 0) + 1;
		let lastError: Error | null = null;

		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), options?.timeout ?? 10000);

			try {
				const response = await fetch(url, {
					method: this.config.method ?? 'GET',
					signal: controller.signal,
					headers: {
						'Content-Type': 'application/json',
						...(this.config.headers ?? {}),
						...(options?.headers ?? {}),
					},
					body:
						this.config.method && this.config.method !== 'GET'
							? this.config.body !== undefined
								? JSON.stringify(this.config.body)
								: undefined
							: undefined,
				});

				if (!response.ok) {
					const body = await response.text();
					const bodySnippet = body.slice(0, 180).replace(/\s+/g, ' ').trim();
					const errorMessage = bodySnippet
						? `HTTP ${response.status}: ${response.statusText} - ${bodySnippet}`
						: `HTTP ${response.status}: ${response.statusText}`;

					if (response.status >= 500 && attempt < maxAttempts) {
						lastError = new Error(errorMessage);
						continue;
					}

					throw new Error(errorMessage);
				}

				return await response.json();
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

	private mapSelector(payload: unknown, selector: AxiosSelectorDefinition): Record<string, string> {
		const rawData: Record<string, string> = {};

		for (const [key, value] of Object.entries(selector)) {
			if (typeof value === 'string') {
				if (key === 'type' || key === 'weightUnit') {
					rawData[key] = value;
					continue;
				}
				if (key === 'price' || key === 'buybackPrice' || key === 'info') {
					rawData[key] = toStringValue(getByPath(payload, value));
					continue;
				}
				rawData[key] = value;
			} else if (typeof value === 'number') {
				rawData[key] = String(value);
			}
		}

		return rawData;
	}

	async scrape<TOutput = T>(
		transformer?: (data: Record<string, string>) => TOutput,
		options?: ScrapingOptions
	): Promise<ScrapingResult<TOutput>> {
		const timestamp = new Date().toISOString();

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

		try {
			let payload = await this.fetchJson(this.config.url, options);
			if (this.config.postProcess) {
				payload = this.config.postProcess(payload as Record<string, string>);
			}
			const selectorItems: AxiosItemDefinition[] =
				this.config.items ??
				(this.config.selector ?? []).map((itemSelector) => ({
					selector: itemSelector,
				}));

			if (selectorItems.length === 0) {
				throw new Error('No selector or items defined in axios config.');
			}

			const items = selectorItems.map(({ selector }) => {
				const rawData = this.mapSelector(payload, selector);
				return transformer ? transformer(rawData) : ((rawData as unknown) as TOutput);
			});

			return {
				success: true,
				data: items,
				count: items.length,
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
}
