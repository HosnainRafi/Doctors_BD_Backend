import { Schema, model } from "mongoose";
import { AppointmentModel } from "./appointment.interface";
import { number } from "zod";

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
      enum: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "pending_payment",
      ],
      default: "pending",
    },
    amount: { type: number },
    reason: { type: String },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

export const Appointment = model<AppointmentModel>(
  "Appointment",
  appointmentSchema
);
