import { z } from "zod";

export const createFollowUpValidation = z.object({
  body: z
    .object({
      appointment_id: z.string().min(1),
      patient_id: z.string().min(1),
      doctor_id: z.string().optional(),
      registered_doctor_id: z.string().optional(),
      scheduled_date: z.string().min(8),
      status: z.enum(["pending", "completed", "cancelled"]).optional(),
      notes: z.string().optional(),
    })
    .refine((data) => data.doctor_id || data.registered_doctor_id, {
      message: "Either doctor_id or registered_doctor_id is required",
    }),
});

export const updateFollowUpValidation = z.object({
  body: z.object({
    appointment_id: z.string().optional(),
    patient_id: z.string().optional(),
    doctor_id: z.string().optional(),
    registered_doctor_id: z.string().optional(),
    scheduled_date: z.string().optional(),
    status: z.enum(["pending", "completed", "cancelled"]).optional(),
    notes: z.string().optional(),
  }),
});

export const FollowUpValidations = {
  createFollowUpValidation,
  updateFollowUpValidation,
};
