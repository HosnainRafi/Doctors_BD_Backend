// src/shared/sendResponse.ts

import { Response } from "express";

export type IApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: any;
  [key: string]: any; // allow extra fields
};

const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  // Destructure statusCode and the rest
  const { statusCode, ...rest } = data;
  res.status(statusCode).json(rest);
};

export default sendResponse;
