import { Request, Response } from "express";
import { PrescriptionService } from "./prescription.service";
import { PrescriptionValidations } from "./prescription.validation";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { generatePrescriptionPDF } from "../../app/utils/prescriptionPdf";
import { Patient } from "../patient/patient.model";
import { Prescription } from "./prescription.model";
import { FollowUp } from "../followup/followup.model";
import { Notification } from "../notifications/notification.model";

const createPrescription = catchAsync(async (req: Request, res: Response) => {
  const body = PrescriptionValidations.createPrescriptionValidation.parse(
    req.body
  );
  const result = await PrescriptionService.createPrescription(body);

  // Auto-create follow-up if follow_up_date is provided
  if (body.follow_up_date) {
    await FollowUp.create({
      appointment_id: body.appointment_id,
      patient_id: body.patient_id,
      doctor_id: body.doctor_id,
      registered_doctor_id: body.registered_doctor_id,
      scheduled_date: body.follow_up_date,
      status: "pending",
      notes: body.advice || "",
    });
  }

  // Create notification for user
  const patient = await Patient.findById(body.patient_id);
  const userId = patient?.user_id; // <-- FIXED

  if (userId) {
    await Notification.create({
      user_id: userId,
      type: "prescription",
      message: `Your prescription from Dr. ... is ready.`,
      isRead: false,
      link: `/user/dashboard`,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Prescription created successfully",
    data: result,
  });
});

const getPrescriptions = catchAsync(async (req: Request, res: Response) => {
  let prescriptions = [];
  if (req.query.user_id) {
    // 1. Get all patients for this user
    const patients = await Patient.find({ user_id: req.query.user_id });
    const patientIds = patients.map((p) => p._id);
    // 2. Get all prescriptions for those patients
    prescriptions = await Prescription.find({ patient_id: { $in: patientIds } })
      .populate("doctor_id")
      .populate("registered_doctor_id") // Add this line
      .populate("patient_id")
      .populate("appointment_id");
  } else {
    // fallback: get all prescriptions (or by other filters)
    prescriptions = await Prescription.find(req.query)
      .populate("doctor_id")
      .populate("registered_doctor_id") // Add this line
      .populate("patient_id")
      .populate("appointment_id");
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Prescriptions retrieved successfully",
    data: prescriptions,
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
  const body = PrescriptionValidations.updatePrescriptionValidation.parse(
    req.body
  );
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
    // Use the updated getPrescription method which now populates registered_doctor_id
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
    console.log(req.params);
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

// In prescription.controller.ts
const sendPrescription = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Find prescription, patient, and send via WhatsApp/email
  // ...your logic here...
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Prescription sent successfully",
    data: null,
  });
});

export const PrescriptionController = {
  createPrescription,
  getPrescriptions,
  getPrescription,
  updatePrescription,
  deletePrescription,
  downloadPrescriptionPdf,
  getPrescriptionsByDoctor,
  getPrescriptionsByRegisteredDoctor,
  sendPrescription,
};
