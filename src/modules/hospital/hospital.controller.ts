import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { HospitalValidations } from "./hospital.validation";
import { HospitalService } from "./hospital.service";

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

// Similar controller methods for get, update, delete...

export const HospitalController = {
  createHospital,
  // getHospitals, getHospital, updateHospital, deleteHospital
};
