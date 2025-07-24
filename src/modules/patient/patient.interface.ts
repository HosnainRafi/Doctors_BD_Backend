import { Document, Types } from "mongoose";

export interface IPatient {
  name: string;
  phone: string;
  email?: string;
  dob?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  weight?: string; // <-- add this
  chief_complaints?: string[]; // <-- add this
  user_id: Types.ObjectId | string;
  isActive?: boolean;
}

export interface PatientModel extends Document, IPatient {
  createdAt: Date;
  updatedAt: Date;
}
