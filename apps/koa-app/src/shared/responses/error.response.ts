import { z } from 'zod';

export const errorResponseZod = z.object({
    error: z.string(),
    details: z.any(),
});

/**
 422 : Response Example
 {
    "success": false,
        "error": "Validation failed",
            "details": [
                {
                    "field": "email",
                    "message": [
                        "Required"
                    ]
                },
                {
                    "field": "password",
                    "message": [
                        "Required"
                    ]
                }
            ]
}
 */