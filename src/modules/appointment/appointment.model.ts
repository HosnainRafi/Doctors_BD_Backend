import { Schema, model } from "mongoose";
import { AppointmentModel } from "./appointment.interface";

const appointmentSchema = new Schema<AppointmentModel>(
  {
    doctor_id: { type: Schema.Types.ObjectId, ref: "Doctor" }, // directory
    registered_doctor_id: {
      type: Schema.Types.ObjectId,
      ref: "RegisteredDoctor",
    }, // online
    patient_id: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    chamber_id: { type: Schema.Types.ObjectId, ref: "Chamber" },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    reason: { type: String },
    user_id: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

export const Appointment = model<AppointmentModel>(
  "Appointment",
  appointmentSchema
);
