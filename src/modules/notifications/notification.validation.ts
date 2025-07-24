import { z } from "zod";

export const createNotificationValidation = z.object({
  user_id: z.string().min(1),
  type: z.enum(["appointment", "prescription", "followup", "message", "other"]),
  message: z.string().min(1),
  isRead: z.boolean().optional(),
  link: z.string().optional(),
});

export const markAsReadValidation = z.object({
  isRead: z.boolean().optional(),
});
