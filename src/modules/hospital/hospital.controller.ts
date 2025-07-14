// hospital.controller.ts
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { HospitalValidations } from "./hospital.validation";
import { HospitalService } from "./hospital.service";
import {
  HospitalFilterableFields,
  hospitalFilterableFields,
  hospitalPaginationFields,
  HospitalPaginationFields,
} from "./hospital.constants";
import { pick } from "../../shared/pick";

const createHospital = catchAsync(async (req: Request, res: Response) => {
  const { body } = HospitalValidations.createHospitalValidation.parse(req);
  const result = await HospitalService.createHospital(body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Hospital created successfully",
    data: result,
  });
});

const getHospitals = catchAsync(async (req: Request, res: Response) => {
  // Parse and validate query parameters first
  const parsedQuery = HospitalValidations.hospitalQueryValidation.parse(
    req.query
  );

  // Cast to the correct types when picking
  const filters = pick(
    parsedQuery,
    hospitalFilterableFields as unknown as (keyof typeof parsedQuery)[]
  );

  // Fix: Explicitly type the options with proper field types
  const options = pick(parsedQuery, hospitalPaginationFields) as {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  };

  const result = await HospitalService.getHospitals(
    filters as Record<HospitalFilterableFields, unknown>,
    options // Now properly typed to match IPaginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Hospitals retrieved successfully",
    data: result,
  });
});
const getHospital = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await HospitalService.getHospital(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Hospital retrieved successfully",
    data: result,
  });
});

const updateHospital = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = HospitalValidations.updateHospitalValidation.parse(req);
  const result = await HospitalService.updateHospital(id, body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Hospital updated successfully",
    data: result,
  });
});

const deleteHospital = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await HospitalService.deleteHospital(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Hospital deleted successfully",
    data: result,
  });
});

export const HospitalController = {
  createHospital,
  getHospitals,
  getHospital,
  updateHospital,
  deleteHospital,
};
