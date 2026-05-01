import { Hono } from 'hono';
import { normalizeGoldPriceRows } from './lib';
import { DbTurso, DbD1 } from './db';
import rootFeature from './features/root';
import healthFeature from './features/health';
import anekalogamFeature from './features/anekalogam';
import hargaEmasOrgFeature from './features/hargaemas-org';
import lakuemasFeature from './features/lakuemas';
import pegadaianFeature from './features/pegadaian';
import sakumasFeature from './features/sakumas';
import kursdolarFeature from './features/kursdolar';
import cermatiFeature from './features/cermati';
import bankbsiFeature from './features/bankbsi';
import brankaslmFeature from './features/brankaslm';
import indogoldFeature from './features/indogold';
import hargaemasNetFeature from './features/hargaemas-net';
import hargaemasComFeature from './features/hargaemas-com';
import treasuryFeature from './features/treasury';
import logammuliaFeature from './features/logammulia';
import emaskuFeature from './features/emasku';
import hartadinataabadiFeature from './features/hartadinataabadi';
import galeri24Feature from './features/galeri24';
import sampoernagoldFeature from './features/sampoernagold';

type Bindings = {
	JINA_API_KEY?: string;
	TURSO_DATABASE_URL?: string;
	TURSO_AUTH_TOKEN?: string;
	DB_D1?: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/api/prices/*', async (c, next) => {
	const source = c.req.path.replace('/api/prices/', '');
	const today = new Date().toISOString().slice(0, 10);

	// Try D1 daily cache first
	if (c.env.DB_D1) {
		try {
			const dbD1 = new DbD1(c.env.DB_D1);
			const cached = await dbD1.getDaily(source, today);
			if (cached.length > 0) {
				return c.json({
					success: true,
					data: cached,
					count: cached.length,
					source,
					currency: 'IDR',
					timestamp: cached[0].recordedAt,
					cached: true,
				});
			}
		} catch (err) {
			console.error(`[db_d1] Cache miss error for ${source}:`, err);
		}
	}

	await next();

	const contentType = c.res.headers.get('content-type') ?? '';
	if (!contentType.includes('application/json')) {
		return;
	}

	const body = await c.res.clone().json().catch(() => null) as Record<string, unknown> | null;
	if (!body || body.success !== true || !('data' in body)) {
		return;
	}

	const currency = typeof body.currency === 'string' ? body.currency : 'IDR';
	const timestamp = body.timestamp as string | number | undefined;

	const normalizedRows = normalizeGoldPriceRows(body.data, {
		source,
		currency,
		recordedAt: timestamp,
		sourceSite: null,
	});

	const responseBody = {
		...body,
		data: normalizedRows,
		count: normalizedRows.length,
		currency,
		source,
	};

	// Save to D1 (daily cache + history)
	if (c.env.DB_D1) {
		try {
			const dbD1 = new DbD1(c.env.DB_D1);
			await dbD1.setDaily(source, today, normalizedRows);
			await dbD1.insertHistory(normalizedRows);
		} catch (err) {
			console.error(`[db_d1] Failed to save for ${source}:`, err);
		}
	}

	// Save to Turso history
	const tursoUrl = c.env.TURSO_DATABASE_URL;
	const tursoToken = c.env.TURSO_AUTH_TOKEN;
	if (tursoUrl && tursoToken) {
		try {
			const dbTurso = new DbTurso(tursoUrl, tursoToken);
			await dbTurso.insertHistory(normalizedRows);
		} catch (err) {
			console.error(`[db_turso] Failed to save history for ${source}:`, err);
		}
	}

	c.res = c.json(responseBody);
});

app.route('/', rootFeature);
app.route('/health', healthFeature);

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
