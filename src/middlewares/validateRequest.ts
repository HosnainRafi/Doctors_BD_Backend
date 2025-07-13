// src/middleware/validateRequest.ts
import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: result.error.format(),
      });
      return; // prevent further execution
    }

    // Optional: replace req.body with parsed data for safety
    req.body = result.data;
    next();
  };
};
