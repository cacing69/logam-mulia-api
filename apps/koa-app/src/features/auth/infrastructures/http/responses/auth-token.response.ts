import { z } from 'zod';

export const authTokenResponseZod = z.object({
    message: z.string(),
    data: z.object({
        user: z.object({
            id: z.string(),
            firstName: z.string(),
            email: z.string().email()
        }),
        token: z.string()
    })
});