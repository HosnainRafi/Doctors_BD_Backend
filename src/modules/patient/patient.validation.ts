import { z } from "zod";

export const createPatientValidation = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional(),
  dob: z.string().optional(),
  age: z.string().optional(), // <-- add this
  gender: z.enum(["male", "female", "other"]).optional(),
  address: z.string().optional(),
  weight: z.string().optional(),
  chief_complaints: z.array(z.string()).optional(),
  user_id: z.string(),
  isActive: z.boolean().optional(),
});

export const updatePatientValidation = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(8).optional(),
  email: z.string().email().optional(),
  dob: z.string().optional(),
  age: z.string().optional(), // <-- add this
  gender: z.enum(["male", "female", "other"]).optional(),
  address: z.string().optional(),
  weight: z.string().optional(),
  chief_complaints: z.array(z.string()).optional(),
  user_id: z.string(),
  isActive: z.boolean().optional(),
});

export const PatientValidations = {
  createPatientValidation,
  updatePatientValidation,
};
