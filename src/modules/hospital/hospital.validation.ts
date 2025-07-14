import mongoose from "mongoose";
import { z } from "zod";

const phoneRegex = /^(?:\+88|01)[0-9]{9,10}$/;

export const createHospitalValidation = z.object({
  body: z.object({
    name: z.string().min(3),
    address: z.string().min(10),
    district: z.string().transform((val) => new mongoose.Types.ObjectId(val)),
    contactNumbers: z.array(z.string().regex(phoneRegex)).min(1),
    googleMapUrl: z.string().url().optional(),
    facilities: z.array(z.string()).optional(),
  }),
});

export const updateHospitalValidation = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    address: z.string().min(10).optional(),
    district: z
      .string()
      .transform((val) => (val ? new mongoose.Types.ObjectId(val) : undefined))
      .optional(),
    contactNumbers: z.array(z.string().regex(phoneRegex)).min(1).optional(),
    googleMapUrl: z.string().url().optional(),
    facilities: z.array(z.string()).optional(),
  }),
});

export const hospitalQueryValidation = z.object({
  searchTerm: z.string().optional(),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined)),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined)),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const HospitalValidations = {
  createHospitalValidation,
  updateHospitalValidation,
  hospitalQueryValidation,
};
