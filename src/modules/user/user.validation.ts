import { z } from "zod";

export const createUserValidation = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(6),
});

export const loginUserValidation = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const UserValidations = {
  createUserValidation,
  loginUserValidation,
};
