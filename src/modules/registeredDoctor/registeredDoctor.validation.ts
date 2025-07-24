import { z } from "zod";

export const createRegisteredDoctorValidation = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(6),
  bmdc_number: z.string().optional(),
  specialty: z.string().optional(),
  photo: z.string().optional(),
  bio: z.string().optional(),
  isVerified: z.boolean().optional(),
  isOnline: z.boolean().optional(),
  availableSlots: z
    .array(
      z.object({
        date: z.string(),
        time: z.string(),
      })
    )
    .optional(),
});

export const updateRegisteredDoctorValidation = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(8).optional(),
  password: z.string().min(6).optional(),
  bmdc_number: z.string().optional(),
  specialty: z.string().optional(),
  photo: z.string().optional(),
  bio: z.string().optional(),
  isVerified: z.boolean().optional(),
  isOnline: z.boolean().optional(),
  availableSlots: z
    .array(
      z.object({
        date: z.string(),
        time: z.string(),
      })
    )
    .optional(),
});
const loginRegisteredDoctorValidation = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisteredDoctorValidations = {
  createRegisteredDoctorValidation,
  updateRegisteredDoctorValidation,
  loginRegisteredDoctorValidation,
};
