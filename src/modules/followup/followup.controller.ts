import { Request, Response } from "express";
import { FollowUpService } from "./followup.service";
import { FollowUpValidations } from "./followup.validation";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { Patient } from "../patient/patient.model";
import { FollowUp } from "./followup.model";
import { Notification } from "../notifications/notification.model";

const createFollowUp = catchAsync(async (req: Request, res: Response) => {
  const followUpData = FollowUpValidations.createFollowUpValidation.parse(
    req.body
  );
  const result = await FollowUpService.createFollowUp(followUpData);

  // If you want to create a notification for the user:
  const patient = await Patient.findById(followUpData.patient_id);
  const userId = patient?.user_id;
  if (userId) {
    await Notification.create({
      user_id: userId,
      type: "followup",
      message: `You have a follow-up scheduled on ${followUpData.scheduled_date}.`,
      isRead: false,
      link: `/user/dashboard`,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Follow-up created successfully",
    data: result,
  });
});

const getFollowUps = catchAsync(async (req: Request, res: Response) => {
  let followUps = [];
  if (req.query.user_id) {
    // 1. Get all patients for this user
    const patients = await Patient.find({ user_id: req.query.user_id });
    const patientIds = patients.map((p) => p._id);
    // 2. Get all follow-ups for those patients
    followUps = await FollowUp.find({ patient_id: { $in: patientIds } })
      .populate("doctor_id")
      .populate("registered_doctor_id")
      .populate("patient_id");
  } else {
    // fallback: get all follow-ups (or by other filters)
    followUps = await FollowUp.find(req.query)
      .populate("doctor_id")
      .populate("registered_doctor_id")
      .populate("patient_id");
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Follow-ups retrieved successfully",
    data: followUps,
  });
});

const getFollowUp = catchAsync(async (req: Request, res: Response) => {
  const result = await FollowUpService.getFollowUp(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Follow-up retrieved successfully",
    data: result,
  });
});

const updateFollowUp = catchAsync(async (req: Request, res: Response) => {
  const body = FollowUpValidations.updateFollowUpValidation.parse(req);
  const result = await FollowUpService.updateFollowUp(req.params.id, body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Follow-up updated successfully",
    data: result,
  });
});

const deleteFollowUp = catchAsync(async (req: Request, res: Response) => {
  const result = await FollowUpService.deleteFollowUp(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Follow-up deleted successfully",
    data: result,
  });
});

const getFollowUpsByDoctor = catchAsync(async (req: Request, res: Response) => {
  const { doctor_id } = req.params;
  const followUps = await FollowUpService.getFollowUpsByDoctor(doctor_id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Follow-ups for doctor retrieved",
    data: followUps,
  });
});

const getFollowUpsByRegisteredDoctor = catchAsync(
  async (req: Request, res: Response) => {
    const { registered_doctor_id } = req.params;
    const followUps = await FollowUpService.getFollowUpsByRegisteredDoctor(
      registered_doctor_id
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Follow-ups for registered doctor retrieved",
      data: followUps,
    });
  }
);

export const FollowUpController = {
  createFollowUp,
  getFollowUps,
  getFollowUp,
  updateFollowUp,
  deleteFollowUp,
  getFollowUpsByDoctor,
  getFollowUpsByRegisteredDoctor,
};
