import { Hono } from 'hono';
import { createErrorResponse, getHistoryBySource } from './lib';
import type { Bindings } from './types';
import rootFeature from './features/root';
import healthFeature from './features/health';
import anekalogamFeature from './features/anekalogam';
import { anekalogamConfig } from './features/anekalogam/anekalogam.config';
import hargaEmasOrgFeature from './features/hargaemas-org';
import lakuemasFeature from './features/lakuemas';
import pegadaianFeature from './features/pegadaian';
import sakumasFeature from './features/sakumas';
import kursdolarFeature from './features/kursdolar';
import cermatiFeature from './features/cermati';
import bankbsiFeature from './features/bankbsi';
import { bankbsiConfig } from './features/bankbsi/bankbsi.config';
import brankaslmFeature from './features/brankaslm';
import { brankaslmConfig } from './features/brankaslm/brankaslm.config';
import indogoldFeature from './features/indogold';
import hargaemasNetFeature from './features/hargaemas-net';
import hargaemasComFeature from './features/hargaemas-com';
import treasuryFeature from './features/treasury';
import logammuliaFeature from './features/logammulia';
import emaskuFeature from './features/emasku';
import { emaskuConfig } from './features/emasku/emasku.config';
import hartadinataabadiFeature from './features/hartadinataabadi';
import galeri24Feature from './features/galeri24';
import sampoernagoldFeature from './features/sampoernagold';

const app = new Hono<{ Bindings: Bindings }>();
const SUPPORTED_SOURCES = new Set([
	anekalogamConfig.name,
	bankbsiConfig.name,
	brankaslmConfig.name,
	emaskuConfig.name,
]);

app.route('/', rootFeature);
app.route('/health', healthFeature);

app.get('/api/prices/:source/history', async (c) => {
	const source = c.req.param('source');
	if (!SUPPORTED_SOURCES.has(source)) {
		return c.json(createErrorResponse('Unknown source'), 404);
	}

	const result = await getHistoryBySource(c.env, source, {
		page: c.req.query('page'),
		length: c.req.query('length'),
		weight: c.req.query('weight'),
	});

	if (!result.success) {
		const statusCode = result.statusCode === 400 ? 400 : 500;
		return c.json(createErrorResponse(result.error ?? 'Unknown error'), statusCode);
	}

	return c.json(result);
});

app.route('/api/prices/anekalogam', anekalogamFeature);
app.route('/api/prices/hargaemas-org', hargaEmasOrgFeature);
app.route('/api/prices/lakuemas', lakuemasFeature);
app.route('/api/prices/pegadaian', pegadaianFeature);
app.route('/api/prices/sakumas', sakumasFeature);
app.route('/api/prices/kursdolar', kursdolarFeature);
app.route('/api/prices/cermati', cermatiFeature);
app.route('/api/prices/bankbsi', bankbsiFeature);
app.route('/api/prices/brankaslm', brankaslmFeature);
app.route('/api/prices/indogold', indogoldFeature);
app.route('/api/prices/hargaemas-net', hargaemasNetFeature);
app.route('/api/prices/hargaemas-com', hargaemasComFeature);
app.route('/api/prices/treasury', treasuryFeature);
app.route('/api/prices/logammulia', logammuliaFeature);
app.route('/api/prices/emasku', emaskuFeature);
app.route('/api/prices/hartadinataabadi', hartadinataabadiFeature);
app.route('/api/prices/galeri24', galeri24Feature);
app.route('/api/prices/sampoernagold', sampoernagoldFeature);

export default app;
