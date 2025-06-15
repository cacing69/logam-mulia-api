import { z } from 'zod';

export const authTokenPayload = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6)
}).strict()

export type AuthTokenPayload = z.infer<typeof authTokenPayload>;