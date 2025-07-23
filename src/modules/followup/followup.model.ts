import { Schema, model } from "mongoose";
import { FollowUpModel } from "./followup.interface";

const followUpSchema = new Schema<FollowUpModel>(
  {
    appointment_id: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    patient_id: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor_id: { type: Schema.Types.ObjectId, ref: "Doctor" },
    registered_doctor_id: {
      type: Schema.Types.ObjectId,
      ref: "RegisteredDoctor",
    },
    scheduled_date: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    notes: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export const FollowUp = model<FollowUpModel>("FollowUp", followUpSchema);
