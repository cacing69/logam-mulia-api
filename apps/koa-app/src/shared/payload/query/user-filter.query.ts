import { z } from "zod";

export const userFilterQuery = z.object({
    email: z.string().optional(),
    firstName: z.string().regex(/^[a-zA-Z\s]+/).optional(),
    sortField: z.string().regex(/^(id|firstName|email|createdAt)$/).optional(),
    sortOrder: z.string().regex(/^(asc|desc)$/).optional(),
});

export type UserFilterQuery = z.infer<typeof userFilterQuery>;