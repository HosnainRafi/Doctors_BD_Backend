import { Document, Types } from "mongoose";

export interface IDoctorSpecialization {
  doctor: Types.ObjectId;
  specialization: Types.ObjectId;
  isPrimary: boolean;
}

export interface DoctorSpecializationModel
  extends Document,
    IDoctorSpecialization {
  createdAt: Date;
  updatedAt: Date;
}
