import { Request, Response } from "express";
import { PatientService } from "./patient.service";
import { PatientValidations } from "./patient.validation";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const { body } = PatientValidations.createPatientValidation.parse(req);
  const result = await PatientService.createPatient(body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

const getPatients = catchAsync(async (req: Request, res: Response) => {
  const result = await PatientService.getPatients(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patients retrieved successfully",
    data: result,
  });
});

const getPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await PatientService.getPatient(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient retrieved successfully",
    data: result,
  });
});

const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const { body } = PatientValidations.updatePatientValidation.parse(req);
  const result = await PatientService.updatePatient(req.params.id, body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient updated successfully",
    data: result,
  });
});

const deletePatient = catchAsync(async (req: Request, res: Response) => {
  const result = await PatientService.deletePatient(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient deleted successfully",
    data: result,
  });
});

export const PatientController = {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
};
