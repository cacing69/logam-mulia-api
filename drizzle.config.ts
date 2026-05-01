import { defineConfig } from 'drizzle-kit';

const isRemote = !!process.env.TURSO_DATABASE_URL;

export default defineConfig({
	schema: './src/db/schema/turso.ts',
	out: './migrations/turso',
	dialect: 'sqlite',
	dbCredentials: {
		url: process.env.TURSO_DATABASE_URL || './local_turso.db',
		...(isRemote && { authToken: process.env.TURSO_AUTH_TOKEN }),
	},
});
