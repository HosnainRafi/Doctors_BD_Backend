import { Request, Response } from "express";
import { RegisteredDoctorService } from "./registeredDoctor.service";
import { RegisteredDoctorValidations } from "./registeredDoctor.validation";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { signJwt } from "../../app/utils/jwt";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const { body } =
    RegisteredDoctorValidations.createRegisteredDoctorValidation.parse(req);
  const result = await RegisteredDoctorService.createDoctor(body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Registered doctor created successfully",
    data: result,
  });
});

const getDoctors = catchAsync(async (req: Request, res: Response) => {
  const result = await RegisteredDoctorService.getDoctors(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Registered doctors retrieved successfully",
    data: result,
  });
});

const getDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await RegisteredDoctorService.getDoctor(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Registered doctor retrieved successfully",
    data: result,
  });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const { body } =
    RegisteredDoctorValidations.updateRegisteredDoctorValidation.parse(req);
  const result = await RegisteredDoctorService.updateDoctor(
    req.params.id,
    body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Registered doctor updated successfully",
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await RegisteredDoctorService.deleteDoctor(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Registered doctor deleted successfully",
    data: result,
  });
});

const loginDoctor = catchAsync(async (req, res) => {
  const { body } =
    RegisteredDoctorValidations.loginRegisteredDoctorValidation.parse(req);
  const doctor = await RegisteredDoctorService.login(body.email, body.password);

  // Generate JWT
  const token = signJwt({
    id: doctor._id,
    email: doctor.email,
    role: "doctor",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: {
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        // ...other fields
      },
    },
  });
});

export const RegisteredDoctorController = {
  createDoctor,
  getDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  loginDoctor,
};
