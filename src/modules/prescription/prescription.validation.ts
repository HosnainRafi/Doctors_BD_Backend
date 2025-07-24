import { z } from "zod";

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
        dose: z.string().min(1),
        timing: z.string().min(1), // <-- required
        duration: z.string().min(1), // <-- required
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
  appointment_id: z.string().optional(),
  doctor_id: z.string().optional(),
  registered_doctor_id: z.string().optional(),
  patient_id: z.string().optional(),
  date: z.string().optional(),
  medicines: z.array(
    z.object({
      name: z.string().min(1),
      timing: z.string().min(1), // <-- add this
      duration: z.string().min(1), // <-- add this
      instructions: z.string().optional(),
    })
  ),
  advice: z.string().optional(),
  follow_up_date: z.string().optional(),
  pdf_url: z.string().optional(),
});

export const PrescriptionValidations = {
  createPrescriptionValidation,
  updatePrescriptionValidation,
};
