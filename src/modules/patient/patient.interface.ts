import { Document, Types } from "mongoose";

export interface IPatient {
  name: string;
  phone: string;
  email?: string;
  dob?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  user_id: Types.ObjectId | string; // <-- required, links to User
  isActive?: boolean;
}

export interface PatientModel extends Document, IPatient {
  createdAt: Date;
  updatedAt: Date;
}
