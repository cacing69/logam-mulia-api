import { sqliteTable, text, integer, real, index, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const priceHistory = sqliteTable(
	'price_history',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		source: text('source').notNull(),
		material: text('material').notNull().default('gold'),
		materialType: text('material_type').notNull().default('unknown'),
		weight: real('weight').notNull().default(1),
		weightUnit: text('weight_unit').notNull().default('gram'),
		sellPrice: integer('sell_price').notNull().default(0),
		buybackPrice: integer('buyback_price'),
		currency: text('currency').notNull().default('IDR'),
		recordedDate: text('recorded_date').notNull(),
		createdAt: text('created_at').notNull(),
		lineKey: text('line_key').notNull().default(''),
	},
	(table) => [
		uniqueIndex('ux_price_history_source_day_material').on(
			table.source,
			table.recordedDate,
			table.materialType,
			table.weight,
			table.weightUnit,
			table.lineKey,
		),
		index('idx_history_source_recorded_date').on(table.source, table.recordedDate),
	],
);
