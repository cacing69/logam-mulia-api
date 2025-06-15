import { z } from 'zod';

export const paginateQuery = z.object({
    cursor: z.string().optional(),
    search: z.string().regex(/^[a-zA-Z0-9\s\.\,\:]+/).optional(),
    limit: z
        .string()
        .transform((val) => parseInt(val))
        .refine((val) => !isNaN(val) && val > 0 && val <= 100, {
            message: 'Limit must be a number between 1 and 100',
        })
        .optional()
        .default('10'),
});

export type PaginateQuery = z.infer<typeof paginateQuery>;