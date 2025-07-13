import { Schema, model } from "mongoose";
import { DoctorSpecializationModel } from "./doctorSpecialization.interface";

const doctorSpecializationSchema = new Schema<DoctorSpecializationModel>(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    specialization: {
      type: Schema.Types.ObjectId,
      ref: "Specialization",
      required: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

// Compound index for unique relationships
doctorSpecializationSchema.index(
  { doctor: 1, specialization: 1 },
  { unique: true }
);

export const DoctorSpecialization = model<DoctorSpecializationModel>(
  "DoctorSpecialization",
  doctorSpecializationSchema
);
