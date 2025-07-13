import { z } from "zod";

const categoryEnum = [
  "General",
  "Surgery",
  "Cardiology",
  "Oncology",
  "Pediatrics",
  "Other",
] as const;

export const createSpecializationValidation = z.object({
  body: z.object({
    name: z.string().min(3).max(100),
    description: z.string().optional(),
    icon: z.string().optional(),
    category: z.enum(categoryEnum).optional(),
    relatedDiseases: z.array(z.string()).optional(),
  }),
});

export const updateSpecializationValidation = z.object({
  body: z.object({
    name: z.string().min(3).max(100).optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    category: z.enum(categoryEnum).optional(),
    relatedDiseases: z.array(z.string()).optional(),
  }),
});

export const SpecializationValidations = {
  createSpecializationValidation,
  updateSpecializationValidation,
};
