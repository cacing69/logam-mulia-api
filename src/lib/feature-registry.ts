import { Hono } from 'hono';
import type { Bindings } from '../types';

export interface FeatureRegistration {
	name: string;
	displayName?: string;
	logo?: string;
	urlHomepage?: string;
	route: Hono<{ Bindings: Bindings }>;
	cached: boolean;
}

export interface SourceInfo {
	name: string;
	displayName?: string;
	logo?: string;
	url: string;
	urlHomepage?: string;
}

export interface PriceFeatureModule {
	register: () => FeatureRegistration;
}

// --- Price feature imports ---
// To add a new price source: (1) create src/features/{name}/, (2) add one import + one entry below.
import * as anekalogam from '../features/anekalogam';
import * as bankbsi from '../features/bankbsi';
import * as brankaslm from '../features/brankaslm';
import * as cermati from '../features/cermati';
import * as emasku from '../features/emasku';
import * as galeri24 from '../features/galeri24';
import * as hargaemasCom from '../features/hargaemas-com';
import * as hargaemasNet from '../features/hargaemas-net';
import * as hargaemasOrg from '../features/hargaemas-org';
import * as hartadinataabadi from '../features/hartadinataabadi';
import * as indogold from '../features/indogold';
import * as kursdolar from '../features/kursdolar';
import * as lakuemas from '../features/lakuemas';
import * as logammulia from '../features/logammulia';
import * as pegadaian from '../features/pegadaian';
import * as sakumas from '../features/sakumas';
import * as sampoernagold from '../features/sampoernagold';
import * as treasury from '../features/treasury';

const priceModules: PriceFeatureModule[] = [
	anekalogam, bankbsi, brankaslm, cermati, emasku, galeri24,
	hargaemasCom, hargaemasNet, hargaemasOrg, hartadinataabadi,
	indogold, kursdolar, lakuemas, logammulia, pegadaian,
	sakumas, sampoernagold, treasury,
];

export function registerPriceFeatures(
	app: Hono<{ Bindings: Bindings }>,
): SourceInfo[] {
	return priceModules.map((mod) => {
		const { name, displayName, logo, urlHomepage, route } = mod.register();
		const sourceUrl = `/api/prices/${name}`;

		const wrapper = new Hono<{ Bindings: Bindings }>();
		wrapper.use('*', async (c, next) => {
			await next();
			try {
				const clone = c.res.clone();
				const json = await clone.json();
				c.res = c.json({
					...(json as Record<string, unknown>),
					url: sourceUrl,
					displayName,
					logo,
					urlHomepage,
				});
			} catch {
				// non-JSON response, skip metadata injection
			}
		});
		wrapper.route('/', route);
		app.route(sourceUrl, wrapper);

		return { name, displayName, logo, url: sourceUrl, urlHomepage };
	});
}
