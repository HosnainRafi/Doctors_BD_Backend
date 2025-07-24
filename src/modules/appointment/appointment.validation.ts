import { z } from "zod";

export const createAppointmentValidation = z
  .object({
    doctor_id: z.string().optional(),
    registered_doctor_id: z.string().optional(),
    patient_id: z.string().min(1),
    chamber_id: z.string().optional(),
    date: z.string().min(8),
    time: z.string().min(4),
    status: z
      .enum(["pending", "confirmed", "cancelled", "completed"])
      .optional(),
    reason: z.string().optional(),
    user_id: z.string().min(1),
    isActive: z.boolean().optional(),
  })
  .refine((data) => data.doctor_id || data.registered_doctor_id, {
    message: "Either doctor_id or registered_doctor_id is required",
  });

export const updateAppointmentValidation = z.object({
  doctor_id: z.string().optional(),
  registered_doctor_id: z.string().optional(),
  patient_id: z.string().optional(),
  chamber_id: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
  reason: z.string().optional(),
  user_id: z.string().min(1),
  isActive: z.boolean().optional(),
});

export const AppointmentValidations = {
  createAppointmentValidation,
  updateAppointmentValidation,
};
