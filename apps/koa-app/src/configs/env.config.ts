import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    APP_PORT: z.string(),
    APP_ENV: z.string(),
    JWT_SECRET: z.string().min(32, 'JWT_SECRET harus minimal 32 karakter'),
    DATABASE_PROVIDER: z.string().default('postgresql'),
    DATABASE_USERNAME: z.string(),
    DATABASE_PASSWORD: z.string().optional(),
    DATABASE_HOST: z.string().default('localhost'),
    DATABASE_PORT: z.coerce.number().int().positive(),
    DATABASE_NAME: z.string(),
    DATABASE_SCHEMA: z.string().default('public')
});

export const env = envSchema.parse(process.env);

export const DATABASE_URL = `${env.DATABASE_PROVIDER}://${env.DATABASE_USERNAME}:${env.DATABASE_PASSWORD || ''}@${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME}?schema=${env.DATABASE_SCHEMA}`;