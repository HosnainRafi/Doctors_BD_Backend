// src/middleware/validateRequest.ts
import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Pass the ZodError to the global error handler
      return next(result.error);
    }

    req.body = result.data;
    next();
  };
};
