// src/app.ts
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import { globalErrorHandler } from "./middlewares/globalErrorandler";
import cookieParser from "cookie-parser";

const app: Application = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies (as sent by HTML forms and SSLCommerz)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies
app.use(cookieParser());

// Enable CORS
app.use(cors());

// Routes
app.use("/api/v1", router);

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Doctors bd backend");
});

// Global error handler
app.use(globalErrorHandler);

export default app;
