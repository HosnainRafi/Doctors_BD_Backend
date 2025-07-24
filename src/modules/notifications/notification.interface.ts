import { Document, Types } from "mongoose";

export interface INotification {
  user_id: Types.ObjectId | string; // or doctor_id for doctor notifications
  type: "appointment" | "prescription" | "followup" | "message" | "other";
  message: string;
  isRead?: boolean;
  link?: string;
}

export interface NotificationModel extends Document, INotification {
  createdAt: Date;
  updatedAt: Date;
}
