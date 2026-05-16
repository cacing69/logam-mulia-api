import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import {
	errorResponseSchema,
	historyResponseSchema,
	priceResponseSchema,
	sourceInfoSchema,
} from './schemas';

export const listSourcesRoute = createRoute({
	method: 'get',
	path: '/api/prices',
	request: {},
	responses: {
		200: {
			content: { 'application/json': { schema: z.array(sourceInfoSchema) } },
			description: 'Daftar sumber yang tersedia',
		},
	},
	tags: ['Sources'],
});

export function createPriceSourceRoute() {
	return createRoute({
		method: 'get',
		path: '/',
		request: {
			query: z.object({
				refresh: z.enum(['true']).optional().openapi({
					description: 'Force re-scrape, bypass cache harian',
				}),
			}),
		},
		responses: {
			200: {
				content: { 'application/json': { schema: priceResponseSchema } },
				description: 'Data harga terkini',
			},
			500: {
				content: { 'application/json': { schema: errorResponseSchema } },
				description: 'Gagal scrape',
			},
		},
		tags: ['Sources'],
	});
}

export const historyRoute = createRoute({
	method: 'get',
	path: '/api/prices/{source}/history',
	request: {
		params: z.object({
			source: z.string().openapi({ description: 'Nama sumber' }),
		}),
		query: z.object({
			page: z
				.string()
				.optional()
				.openapi({ description: 'Nomor halaman (default 1)' }),
			length: z
				.string()
				.optional()
				.openapi({ description: 'Item per halaman (default 20, max 1000)' }),
			weight: z
				.string()
				.optional()
				.openapi({ description: 'Filter berat (gram)' }),
			materialType: z
				.string()
				.optional()
				.openapi({ description: 'Filter tipe material' }),
		}),
	},
	responses: {
		200: {
			content: { 'application/json': { schema: historyResponseSchema } },
			description: 'Riwayat harga',
		},
		400: {
			content: { 'application/json': { schema: errorResponseSchema } },
			description: 'Parameter tidak valid',
		},
		404: {
			content: { 'application/json': { schema: errorResponseSchema } },
			description: 'Source tidak dikenal',
		},
		500: {
			content: { 'application/json': { schema: errorResponseSchema } },
			description: 'Server error',
		},
	},
	tags: ['History'],
});
