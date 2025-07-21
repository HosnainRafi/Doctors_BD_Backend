import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { HospitalService } from "./hospital.service";
import { HospitalValidations } from "./hospital.validation";
import { pick } from "../../shared/pick";
import {
  hospitalFilterableFields,
  hospitalPaginationFields,
  HospitalFilterableFields,
} from "./hospital.constants";

// Create hospital
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

// Get paginated list of hospitals
const getHospitals = catchAsync(async (req: Request, res: Response) => {
  const parsedQuery = HospitalValidations.hospitalQueryValidation.parse(
    req.query
  );

  const filters = pick(
    parsedQuery,
    Array.from(hospitalFilterableFields) as (keyof typeof parsedQuery)[]
  );

  const options = pick(parsedQuery, hospitalPaginationFields) as {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  };

  const result = await HospitalService.getHospitals(
    filters as Record<HospitalFilterableFields, unknown>,
    options
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Hospitals retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// Get a single hospital by ID
const getHospital = catchAsync(async (req: Request, res: Response) => {
  const result = await HospitalService.getHospital(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Hospital retrieved successfully",
    data: result,
  });
});

// Update hospital by ID
const updateHospital = catchAsync(async (req: Request, res: Response) => {
  const { body } = HospitalValidations.updateHospitalValidation.parse(req);
  const result = await HospitalService.updateHospital(req.params.id, body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Hospital updated successfully",
    data: result,
  });
});

// Soft delete hospital by ID
const deleteHospital = catchAsync(async (req: Request, res: Response) => {
  const result = await HospitalService.deleteHospital(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Hospital deleted successfully",
    data: result,
  });
});

// New: Get all doctors for a hospital
const getHospitalDoctors = catchAsync(async (req: Request, res: Response) => {
  const doctors = await HospitalService.getHospitalDoctors(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctors for hospital retrieved successfully",
    data: doctors,
  });
});

export const HospitalController = {
  createHospital,
  getHospitals,
  getHospital,
  updateHospital,
  deleteHospital,
  getHospitalDoctors, // <-- Export the new controller
};
