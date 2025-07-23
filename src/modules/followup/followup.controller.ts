import { Request, Response } from "express";
import { FollowUpService } from "./followup.service";
import { FollowUpValidations } from "./followup.validation";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const createFollowUp = catchAsync(async (req: Request, res: Response) => {
  const { body } = FollowUpValidations.createFollowUpValidation.parse(req);
  const result = await FollowUpService.createFollowUp(body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Follow-up created successfully",
    data: result,
  });
});

const getFollowUps = catchAsync(async (req: Request, res: Response) => {
  const result = await FollowUpService.getFollowUps(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Follow-ups retrieved successfully",
    data: result,
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
  const { body } = FollowUpValidations.updateFollowUpValidation.parse(req);
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
