import { z } from 'zod';
import type { Context } from 'koa';

// Tipe untuk response detail error
type ValidationErrorGroup = {
    field: string;
    message: string[];
};

export function validateRequestBody<T extends z.Schema>(schema: T) {
    return async (ctx: Context, next: () => Promise<void>) => {
        // Ubah jadi langsung parse body tanpa wrapping "body"

        const input = ctx.request.body;

        const result = schema.safeParse(input);

        if (!result.success) {
            // Temporary object untuk menampung pesan error per field
            const tempErrors: Record<string, string[]> = {};

            for (const issue of result.error.issues) {
                const fieldPath = issue.path.join('.'); // contoh: "name", bukan "body.name"
                if (!tempErrors[fieldPath]) {
                    tempErrors[fieldPath] = [];
                }

                tempErrors[fieldPath].push(issue.message);
            }

            // Ubah Record ke Array<Group>
            const formattedErrors = Object.entries(tempErrors).map(([field, messages]) => ({
                field,
                message: messages
            })) satisfies ValidationErrorGroup[];

            ctx.status = 422;
            ctx.body = {
                error: 'Validation failed',
                details: formattedErrors
            };

            return;
        }

        await next();
    };
}