import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorServices } from "./doctor.service";
import { DoctorSpecialization } from "../doctor-specialization/doctorSpecialization.model";
import { doctorValidations } from "./doctor.validation";
import { TDoctor } from "./doctor.interface";
import { Query } from "express-serve-static-core";
import mongoose from "mongoose";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const doctorData = doctorValidations.createDoctorValidation.parse(req.body);
  const result = await DoctorServices.createDoctor(doctorData.body);
  console.log(result);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorServices.getAllDoctors(req.query as Query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctors retrieved successfully",
    data: result,
  });
});

const getSingleDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorServices.getSingleDoctor(id);
  console.log(result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor retrieved successfully",
    data: result,
  });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = doctorValidations.updateDoctorValidation.parse(req);
  const result = await DoctorServices.updateDoctor(id, body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor updated successfully",
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorServices.deleteDoctor(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor deleted successfully",
    data: result,
  });
});

const getDoctorsBySpecialization = catchAsync(
  async (req: Request, res: Response) => {
    const { specializationId } = req.params;

    const doctors = await DoctorSpecialization.find({
      specialization: specializationId,
    })
      .populate("doctor")
      .populate("specialization");

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Doctors retrieved by specialization",
      data: doctors,
    });
  }
);

const restoreDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorServices.restoreDoctor(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor restored successfully",
    data: result,
  });
});

const getDeletedDoctors = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorServices.getDeletedDoctors();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deleted doctors retrieved successfully",
    data: result,
  });
});

const importDoctors = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new Error("No file uploaded");
  }

  const doctorsData: TDoctor[] = JSON.parse(req.file.buffer.toString());
  const validationResults = await Promise.allSettled(
    doctorsData.map((doctor) =>
      doctorValidations.createDoctorValidation.parseAsync({ body: doctor })
    )
  );

  const validDoctors: TDoctor[] = [];
  const errors: { doctor: Partial<TDoctor>; error: string }[] = [];

  validationResults.forEach((result, index) => {
    if (result.status === "fulfilled") {
      validDoctors.push(result.value.body);
    } else {
      errors.push({
        doctor: doctorsData[index],
        error: result.reason.errors?.[0]?.message || "Validation failed",
      });
    }
  });

  const createdDoctors = await Promise.all(
    validDoctors.map((doctor) => DoctorServices.createDoctor(doctor))
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `Import completed: ${createdDoctors.length} succeeded, ${errors.length} failed`,
    data: {
      successes: createdDoctors,
      errors,
    },
  });

  // NEW FUNCTION (properly placed at the root level)
});

export const doctorController = {
  createDoctor,
  getAllDoctors,
  getSingleDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsBySpecialization,
  restoreDoctor,
  importDoctors,
  getDeletedDoctors,
};
