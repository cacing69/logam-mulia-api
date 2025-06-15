import { z } from "zod";

export const testPublicResponseZod = z.object({
  message: z.string(),
  data: z.object({
    type: z.string(),
  }),
});
