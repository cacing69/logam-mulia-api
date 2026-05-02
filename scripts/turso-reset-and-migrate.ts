/**
 * Reset tabel `price_history` di Turso (URL dari env) lalu jalankan ulang `migrations/turso/0001_*.sql`.
 * Memuat variabel seperti Wrangler: `.env` (opsional), lalu **`.dev.vars`** mengoverride kunci yang sama.
 * Isi `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` di `.dev.vars` (atau `.env`).
 *
 *   npx tsx scripts/turso-reset-and-migrate.ts
 *
 * Atau: `npm run db:turso:reset-remote`
 */
import { createClient } from '@libsql/client';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function applyVarsFromFile(raw: string, mode: 'fill' | 'override'): void {
	for (const line of raw.split('\n')) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) {
			continue;
		}
		const eq = trimmed.indexOf('=');
		if (eq <= 0) {
			continue;
		}
		const key = trimmed.slice(0, eq).trim();
		let val = trimmed.slice(eq + 1).trim();
		if (
			(val.startsWith('"') && val.endsWith('"')) ||
			(val.startsWith("'") && val.endsWith("'"))
		) {
			val = val.slice(1, -1);
		}
		if (mode === 'fill' && process.env[key] !== undefined) {
			continue;
		}
		process.env[key] = val;
	}
}

/** Urutan: `.env` (hanya mengisi yang kosong), lalu `.dev.vars` (override — sama pola rahasia lokal Wrangler). */
function loadEnvFromProjectRoot(): void {
	const envPath = join(root, '.env');
	const devVarsPath = join(root, '.dev.vars');
	if (existsSync(envPath)) {
		applyVarsFromFile(readFileSync(envPath, 'utf8'), 'fill');
	}
	if (existsSync(devVarsPath)) {
		applyVarsFromFile(readFileSync(devVarsPath, 'utf8'), 'override');
	}
}

function stripLeadingLineComments(sql: string): string {
	return sql
		.split('\n')
		.filter((l) => !/^\s*--/.test(l))
		.join('\n');
}

function splitSqlStatements(sql: string): string[] {
	return stripLeadingLineComments(sql)
		.split(';')
		.map((s) => s.trim())
		.filter((s) => s.length > 0);
}

async function main(): Promise<void> {
	loadEnvFromProjectRoot();
	const url = process.env.TURSO_DATABASE_URL;
	const authToken = process.env.TURSO_AUTH_TOKEN ?? '';

	if (!url) {
		console.error(
			'Missing TURSO_DATABASE_URL (set env or add TURSO_DATABASE_URL to .dev.vars or .env).',
		);
		process.exit(1);
	}
	if (url.startsWith('file:') || url.includes('local_turso.db')) {
		console.error(
			'Refusing: TURSO_DATABASE_URL looks like a local file. For local DB use: sqlite3 local_turso.db < scripts/turso-reset-data.sql && sqlite3 local_turso.db < migrations/turso/0001_create_price_history.sql',
		);
		process.exit(1);
	}
	if (!authToken) {
		console.error('Missing TURSO_AUTH_TOKEN for remote Turso.');
		process.exit(1);
	}

	const resetSql = readFileSync(join(root, 'scripts/turso-reset-data.sql'), 'utf8');
	const migrationSql = readFileSync(
		join(root, 'migrations/turso/0001_create_price_history.sql'),
		'utf8',
	);

	const stmts = [...splitSqlStatements(resetSql), ...splitSqlStatements(migrationSql)];

	const client = createClient({ url, authToken });
	try {
		await client.batch(stmts, 'write');
		console.log(`Applied ${stmts.length} statement(s) to Turso.`);
	} finally {
		client.close();
	}
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
