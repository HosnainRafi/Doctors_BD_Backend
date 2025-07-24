import { Schema, model } from "mongoose";
import { NotificationModel } from "./notification.interface";

const notificationSchema = new Schema<NotificationModel>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["appointment", "prescription", "followup", "message", "other"],
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export const Notification = model<NotificationModel>(
  "Notification",
  notificationSchema
);
