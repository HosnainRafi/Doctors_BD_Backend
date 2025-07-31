// In prescription.validation.ts

import { z } from "zod";

// Alternative approach that avoids the type inference issue
const objectIdSchemaAlt = z.preprocess((val) => {
  if (typeof val === "string") return val;
  if (val && typeof val === "object" && "_id" in val) {
    return (val as any)._id;
  }
  return val;
}, z.string().min(1));

export const createPrescriptionValidation = z
  .object({
    appointment_id: z.string().min(1),
    patient_id: z.string().min(1),
    doctor_id: z.string().optional(),
    registered_doctor_id: z.string().optional(),
    date: z.string().min(8),
    medicines: z.array(
      z.object({
        name: z.string().min(1),
        timing: z.string().min(1),
        duration: z.string().min(1),
        instructions: z.string().optional(),
      })
    ),
    advice: z.string().optional(),
    follow_up_date: z.string().optional(),
    pdf_url: z.string().optional(),
  })
  .refine((data) => data.doctor_id || data.registered_doctor_id, {
    message: "Either doctor_id or registered_doctor_id is required",
  });

export const updatePrescriptionValidation = z.object({
  appointment_id: objectIdSchemaAlt.optional(),
  doctor_id: objectIdSchemaAlt.optional(),
  registered_doctor_id: objectIdSchemaAlt.optional(),
  patient_id: objectIdSchemaAlt.optional(),
  date: z.string().optional(),
  medicines: z
    .array(
      z.object({
        name: z.string().min(1),
        timing: z.string().min(1),
        duration: z.string().min(1),
        instructions: z.string().optional(),
      })
    )
    .optional(),
  advice: z.string().optional(),
  follow_up_date: z.string().optional(),
  pdf_url: z.string().optional(),
});

export const PrescriptionValidations = {
  createPrescriptionValidation,
  updatePrescriptionValidation,
};
