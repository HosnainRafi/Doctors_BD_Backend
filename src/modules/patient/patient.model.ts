import { Schema, model } from "mongoose";
import { PatientModel } from "./patient.interface";

const patientSchema = new Schema<PatientModel>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    dob: { type: String },
    age: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] },
    address: { type: String },
    weight: { type: String }, // <-- add this
    chief_complaints: [{ type: String }], // <-- add this
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

export const Patient = model<PatientModel>("Patient", patientSchema);
