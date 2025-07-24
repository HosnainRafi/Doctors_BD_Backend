import { z } from "zod";

export const createReviewValidation = z.object({
  doctor_id: z.string().min(1),
  patient_id: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const replyReviewValidation = z.object({
  reply: z.string().min(1),
});
