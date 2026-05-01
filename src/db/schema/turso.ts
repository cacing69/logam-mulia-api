import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';

export const priceHistory = sqliteTable(
	'price_history',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		source: text('source').notNull(),
		goldType: text('gold_type').notNull().default('unknown'),
		weight: real('weight').notNull().default(1),
		weightUnit: text('weight_unit').notNull().default('gram'),
		sellPrice: integer('sell_price').notNull().default(0),
		buybackPrice: integer('buyback_price'),
		currency: text('currency').notNull().default('IDR'),
		recordedAt: integer('recorded_at').notNull(),
		createdAt: integer('created_at').notNull().default(0),
	},
	(table) => [
		index('idx_history_source_recorded').on(table.source, table.recordedAt),
	],
);
