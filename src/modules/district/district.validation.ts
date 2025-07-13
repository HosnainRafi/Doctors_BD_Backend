import { z } from "zod";

const createDistrictValidation = z.object({
  body: z.object({
    name: z.string().min(2),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    isActive: z.boolean().optional().default(true), // Added with default
    geoBoundaries: z.any().optional(), // Basic GeoJSON validation
  }),
});

// Update validation remains the same
const updateDistrictValidation = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    slug: z
      .string()
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    isActive: z.boolean().optional(),
  }),
});

export const DistrictValidations = {
  createDistrictValidation,
  updateDistrictValidation,
};
