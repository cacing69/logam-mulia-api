import { z } from 'zod';

export const userUpdatePayload = z.object(
    {
        firstName: z.string()
            .min(3, 'Name must be at least 3 characters')
            .regex(/^[A-Za-z\s]+$/, 'Name cannot contain numbers or special characters').optional(),
        email: z.string().email('Invalid email address').optional(),
        password: z.string().min(6).optional()
    }
).strict();

export type UserUpdatePayload = z.infer<typeof userUpdatePayload>;