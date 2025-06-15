import { z } from 'zod';

export const successResponseZod = z.object({
    message: z.string(),
    data: z.any(),
    meta: z.any(),
});