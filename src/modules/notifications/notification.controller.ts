import { Request, Response } from "express";
import { NotificationService } from "./notification.service";
import {
  createNotificationValidation,
  markAsReadValidation,
} from "./notification.validation";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const createNotification = catchAsync(async (req: Request, res: Response) => {
  const body = createNotificationValidation.parse(req.body);
  const result = await NotificationService.createNotification(body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Notification created successfully",
    data: result,
  });
});

const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationService.getNotifications(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notifications retrieved successfully",
    data: result,
  });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await markAsReadValidation.parseAsync(req.body); // optional, for future
  const result = await NotificationService.markAsRead(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notification marked as read",
    data: result,
  });
});

const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  const { user_id } = req.query;
  if (!user_id) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "user_id is required",
      data: null,
    });
  }
  const result = await NotificationService.markAllAsRead(user_id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All notifications marked as read",
    data: result,
  });
});

export const NotificationController = {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
};
