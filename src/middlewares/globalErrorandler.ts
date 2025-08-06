import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

type TErrorSource = {
  path: string | number;
  message: string;
};

export const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || (err instanceof ZodError ? 400 : 500);
  let message = err.message || "Internal Server Error";
  let errorSource: TErrorSource[] = [];

  if (err instanceof ZodError) {
    // Use a generic message or the first issue's message
    message = "Validation Error";
    errorSource = err.issues.map((e) => ({
      path: e.path.length ? e.path.join(".") : "Unknown",
      message: e.message || "Validation error",
    }));
  } else {
    errorSource = [
      {
        path: err.path || req.originalUrl || "Unknown",
        message: err.message || "An error occurred",
      },
    ];
  }

  const response: any = {
    success: false,
    message,
    errorSource,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
