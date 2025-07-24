import { Schema, model } from "mongoose";
import { PrescriptionModel } from "./prescription.interface";

const medicineSchema = new Schema(
  {
    name: { type: String, required: true },
    timing: { type: String, required: true }, // <-- add this
    duration: { type: String, required: true }, // <-- add this
    instructions: { type: String },
  },
  { _id: false }
);

const prescriptionSchema = new Schema<PrescriptionModel>(
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
    date: { type: String, required: true },
    medicines: { type: [medicineSchema], required: true },
    advice: { type: String },
    follow_up_date: { type: String },
    pdf_url: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export const Prescription = model<PrescriptionModel>(
  "Prescription",
  prescriptionSchema
);
