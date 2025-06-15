import { z } from "zod";

export const listRoleResponseZod = z.object({
  message: z.string(),
});
