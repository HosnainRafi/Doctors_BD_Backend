import { z } from "zod";

export const createSpecialtyCategoryValidation = z.object({
  name: z.string().min(2),
});

export const updateSpecialtyCategoryValidation = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
  }),
});

export const specialtyCategoryQueryValidation = z.object({
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

export const SpecialtyCategoryValidations = {
  createSpecialtyCategoryValidation,
  updateSpecialtyCategoryValidation,
  specialtyCategoryQueryValidation,
};
