import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";

import { globalErrorHandler } from "./middlewares/globalErrorandler";
import router from "./app/routes";

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Doctors bd backend");
});

app.use(globalErrorHandler);

export default app;
