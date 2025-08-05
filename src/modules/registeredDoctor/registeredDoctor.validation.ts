import { z } from "zod";

export const createRegisteredDoctorValidation = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(6),
  bmdc_number: z.string().optional(),
  specialty: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  district: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  degree_names: z.array(z.string()).optional(),
  additional_qualifications: z.array(z.string()).optional(),
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
  blockedSlots: z
    .array(
      z.object({
        date: z.string(),
        time: z.string(),
      })
    )
    .optional(),
  schedules: z
    .array(
      z.object({
        visiting_method: z.string(),
        visiting_day: z.string(),
        from_time: z.string(),
        to_time: z.string(),
      })
    )
    .optional(),
  consultation: z
    .object({
      standard_fee: z.number(),
      standard_fee_with_vat: z.number(),
      standard_fee_discount: z.number().optional(),
      standard_fee_discount_with_vat: z.number().optional(),
      standard_fee_discount_expire: z.string().optional(),
      follow_up_fee: z.number().optional(),
      follow_up_fee_with_vat: z.number().optional(),
      follow_up_fee_discount: z.number().optional(),
      follow_up_fee_discount_with_vat: z.number().optional(),
      follow_up_fee_discount_expire: z.string().optional(),
      follow_up_within_day: z.number().optional(),
      average_waiting_minutes: z.number().optional(),
      average_consultation_minutes: z.number().optional(),
    })
    .optional(),
  experiences: z
    .array(
      z.object({
        organization_name: z.string(),
        designation: z.string(),
        department: z.string().optional(),
        from: z.string(),
        to: z.string().optional(),
        is_current: z.boolean().optional(),
        duration_month: z.number().optional(),
      })
    )
    .optional(),
  no_of_patients_served: z.number().optional(),
  profileCompleted: z.boolean().default(false),
  review: z
    .object({
      average_rating: z.number(),
      total_reviews: z.number(),
    })
    .optional(),
});

export const updateRegisteredDoctorValidation =
  createRegisteredDoctorValidation.partial();

export const loginRegisteredDoctorValidation = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisteredDoctorValidations = {
  createRegisteredDoctorValidation,
  updateRegisteredDoctorValidation,
  loginRegisteredDoctorValidation,
};
