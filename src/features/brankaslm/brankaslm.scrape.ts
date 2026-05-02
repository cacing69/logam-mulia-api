import type { Bindings } from '../../types';
import {
	scrapeJinaMarkdownLabelForFetchOrCache,
	scrapeJinaMarkdownLabelPrices,
	type JinaMarkdownLabelFetchOrCacheScrapeResult,
	type JinaMarkdownLabelScrapeBody,
	type JinaMarkdownLabelScrapeResult,
} from '../../lib/scrapers/jina-markdown-label-scrape';
import type { ScrapingOptions } from '../../lib/types/scraper.types';
import { brankaslmConfig } from './brankaslm.config';

/** Alias tipe agar impor dari paket `brankaslm` tetap stabil. */
export type BrankaslmScrapeBody = JinaMarkdownLabelScrapeBody;
export type BrankaslmScrapeResult = JinaMarkdownLabelScrapeResult;
export type BrankaslmFetchOrCacheScrapeResult = JinaMarkdownLabelFetchOrCacheScrapeResult;

export async function scrapeBrankaslmForFetchOrCache(
	env: Bindings,
	options?: ScrapingOptions,
): Promise<BrankaslmFetchOrCacheScrapeResult> {
	return scrapeJinaMarkdownLabelForFetchOrCache(env, brankaslmConfig, options);
}

export async function scrapeBrankaslmPrices(
	env: Bindings,
	options?: ScrapingOptions,
): Promise<BrankaslmScrapeResult> {
	return scrapeJinaMarkdownLabelPrices(env, brankaslmConfig, options);
}
