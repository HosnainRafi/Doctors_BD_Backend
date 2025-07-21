// src/modules/doctor/doctor.validation.ts
import mongoose from "mongoose";
import { z } from "zod";

const timeSlotValidation = z.object({
  start_time_24hr: z.string(),
  end_time_24hr: z.string(),
  original_time: z.string(),
});

const visitingHoursValidation = z.object({
  visiting_days: z.array(z.string()),
  visiting_hours: z.array(z.string()),
  closed_days: z.array(z.string()),
  original_text: z.string(),
  time_slots: z.array(timeSlotValidation),
});

const chamberValidation = z.object({
  hospital_name: z.string(),
  address: z.string(),
  appointment_contact: z.string(),
  visiting_hours: visitingHoursValidation,
  url: z.string().url(),
});

export const createDoctorValidation = z.object({
  body: z.object({
    id: z.string(),
    district: z.string(),
    name: z.string(),
    photo: z.string().url(),
    degree: z.string(),
    specialty: z.string(),
    workplace: z.string(),
    hospital_name: z.string(),
    hospital_link: z.string().url(),
    rating: z.string(),
    chambers: z.array(chamberValidation),
    profile_url: z.string().url(),
    designation: z.string(),
    source_hospital: z.string(),
    hospitalIds: z
      .array(z.string().transform((val) => new mongoose.Types.ObjectId(val)))
      .optional(),
    specialtyList: z.array(z.string()),
    specialtyCategories: z.array(z.string()),
  }),
});

export const updateDoctorValidation = z.object({
  body: createDoctorValidation.shape.body.partial(),
  params: z.object({
    id: z.string(),
  }),
});

export const doctorValidations = {
  createDoctorValidation,
  updateDoctorValidation,
};
