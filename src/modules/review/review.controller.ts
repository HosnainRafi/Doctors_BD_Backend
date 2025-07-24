import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import {
  createReviewValidation,
  replyReviewValidation,
} from "./review.validation";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const body = createReviewValidation.parse(req.body);
  const result = await ReviewService.createReview(body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const getReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getReviews(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

const getReviewsByDoctor = catchAsync(async (req: Request, res: Response) => {
  const { doctor_id } = req.params;
  const result = await ReviewService.getReviewsByDoctor(doctor_id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews for doctor retrieved",
    data: result,
  });
});

const replyToReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reply } = replyReviewValidation.parse(req.body);
  const result = await ReviewService.replyToReview(id, reply);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reply added to review",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getReviews,
  getReviewsByDoctor,
  replyToReview,
};
