import { Request, Response } from "express";
import { RegisteredDoctorService } from "./registeredDoctor.service";
import { RegisteredDoctorValidations } from "./registeredDoctor.validation";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { signJwt } from "../../app/utils/jwt";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const newuser =
    RegisteredDoctorValidations.createRegisteredDoctorValidation.parse(
      req.body
    );
  console.log(req.body);
  const result = await RegisteredDoctorService.createDoctor(newuser);

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

const getDoctorByEmail = catchAsync(async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Email is required",
      data: null,
    });
  }
  const doctor = await RegisteredDoctorService.getDoctorByEmail(
    email as string
  );
  if (!doctor) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Doctor not found",
      data: null,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor retrieved successfully",
    data: doctor,
  });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const newUser =
    RegisteredDoctorValidations.updateRegisteredDoctorValidation.parse(
      req.body
    );
  const result = await RegisteredDoctorService.updateDoctor(
    req.params.id,
    newUser
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
  const newUser =
    RegisteredDoctorValidations.loginRegisteredDoctorValidation.parse(req.body);
  const doctor = await RegisteredDoctorService.login(
    newUser.email,
    newUser.password
  );
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

const getDetailedEarnings = catchAsync(async (req: Request, res: Response) => {
  const { registered_doctor_id } = req.params;
  const earnings = await RegisteredDoctorService.getDetailedEarnings(
    registered_doctor_id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Detailed earnings retrieved successfully",
    data: earnings,
  });
});

export const RegisteredDoctorController = {
  createDoctor,
  getDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  loginDoctor,
  getDoctorByEmail,
  getDetailedEarnings,
};
