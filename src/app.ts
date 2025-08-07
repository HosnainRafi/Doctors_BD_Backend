// src/app.ts

import express, { Application, Request, Response } from "express";
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

app.use(
  cors({
    origin: true,

    credentials: true,

    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",

    allowedHeaders: "Content-Type, Authorization",
  })
);

// Application Routes
app.use("/api/v1", router);

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Doctors bd backend");
});

// Global error handler (must be placed after all routes)
app.use(globalErrorHandler);

export default app;
