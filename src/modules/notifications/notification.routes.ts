import express from "express";
import { NotificationController } from "./notification.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createNotificationValidation,
  markAsReadValidation,
} from "./notification.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(createNotificationValidation),
  NotificationController.createNotification
);

router.get("/", NotificationController.getNotifications);

router.patch(
  "/:id/read",
  validateRequest(markAsReadValidation),
  NotificationController.markAsRead
);

router.patch("/mark-all-read", NotificationController.markAllAsRead);

export const NotificationRoutes = router;
