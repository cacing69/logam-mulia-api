import type { Bindings } from '../../types';
import {
	scrapeJinaMarkdownLabelForFetchOrCache,
	scrapeJinaMarkdownLabelPrices,
	type JinaMarkdownLabelFetchOrCacheScrapeResult,
	type JinaMarkdownLabelScrapeBody,
	type JinaMarkdownLabelScrapeResult,
} from '../../lib/scrapers/jina-markdown-label-scrape';
import type { ScrapingOptions } from '../../lib/types/scraper.types';
import { lakuemasConfig } from './config';

export type LakuemasScrapeBody = JinaMarkdownLabelScrapeBody;
export type LakuemasScrapeResult = JinaMarkdownLabelScrapeResult;
export type LakuemasFetchOrCacheScrapeResult = JinaMarkdownLabelFetchOrCacheScrapeResult;

export async function scrapeLakuemasForFetchOrCache(
	env: Bindings,
	options?: ScrapingOptions,
): Promise<LakuemasFetchOrCacheScrapeResult> {
	return scrapeJinaMarkdownLabelForFetchOrCache(env, lakuemasConfig, options);
}

export async function scrapeLakuemasPrices(
	env: Bindings,
	options?: ScrapingOptions,
): Promise<LakuemasScrapeResult> {
	return scrapeJinaMarkdownLabelPrices(env, lakuemasConfig, options);
}
