import { z } from "zod";

export const medexSearchValidation = z.object({
  query: z.string().min(1, "Query is required"),
});
