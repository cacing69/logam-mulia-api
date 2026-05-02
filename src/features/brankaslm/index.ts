export { brankaslmConfig } from './brankaslm.config';
export { scrapeBrankaslmForFetchOrCache, scrapeBrankaslmPrices } from './brankaslm.scrape';
export type {
	BrankaslmFetchOrCacheScrapeResult,
	BrankaslmScrapeBody,
	BrankaslmScrapeResult,
} from './brankaslm.scrape';

import route from './brankaslm.route';
export default route;
