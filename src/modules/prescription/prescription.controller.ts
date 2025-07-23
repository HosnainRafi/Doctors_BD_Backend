import { Request, Response } from "express";
import { PrescriptionService } from "./prescription.service";
import { PrescriptionValidations } from "./prescription.validation";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { generatePrescriptionPDF } from "../../app/utils/prescriptionPdf";

const createPrescription = catchAsync(async (req: Request, res: Response) => {
  const { body } =
    PrescriptionValidations.createPrescriptionValidation.parse(req);
  const result = await PrescriptionService.createPrescription(body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Prescription created successfully",
    data: result,
  });
});

const getPrescriptions = catchAsync(async (req: Request, res: Response) => {
  const result = await PrescriptionService.getPrescriptions(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Prescriptions retrieved successfully",
    data: result,
  });
});

const getPrescription = catchAsync(async (req: Request, res: Response) => {
  const result = await PrescriptionService.getPrescription(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Prescription retrieved successfully",
    data: result,
  });
});

const updatePrescription = catchAsync(async (req: Request, res: Response) => {
  const { body } =
    PrescriptionValidations.updatePrescriptionValidation.parse(req);
  const result = await PrescriptionService.updatePrescription(
    req.params.id,
    body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Prescription updated successfully",
    data: result,
  });
});

const deletePrescription = catchAsync(async (req: Request, res: Response) => {
  const result = await PrescriptionService.deletePrescription(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Prescription deleted successfully",
    data: result,
  });
});

const downloadPrescriptionPdf = catchAsync(
  async (req: Request, res: Response) => {
    const prescription = await PrescriptionService.getPrescription(
      req.params.id
    );
    if (!prescription) {
      return res.status(404).send("Prescription not found");
    }
    generatePrescriptionPDF(prescription, res);
  }
);

const getPrescriptionsByDoctor = catchAsync(
  async (req: Request, res: Response) => {
    const { doctor_id } = req.params;
    const prescriptions = await PrescriptionService.getPrescriptionsByDoctor(
      doctor_id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Prescriptions for doctor retrieved",
      data: prescriptions,
    });
  }
);

const getPrescriptionsByRegisteredDoctor = catchAsync(
  async (req: Request, res: Response) => {
    const { registered_doctor_id } = req.params;
    const prescriptions =
      await PrescriptionService.getPrescriptionsByRegisteredDoctor(
        registered_doctor_id
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Prescriptions for registered doctor retrieved",
      data: prescriptions,
    });
  }
);

export const PrescriptionController = {
  createPrescription,
  getPrescriptions,
  getPrescription,
  updatePrescription,
  deletePrescription,
  downloadPrescriptionPdf,
  getPrescriptionsByDoctor,
  getPrescriptionsByRegisteredDoctor,
};
