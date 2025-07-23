import { Document } from "mongoose";

export interface IPatient {
  name: string;
  phone: string;
  email?: string;
  dob?: string; // ISO date string
  gender?: "male" | "female" | "other";
  address?: string;
  user_id?: string; // If linked to a user account
  isActive?: boolean;
}

export interface PatientModel extends Document, IPatient {
  createdAt: Date;
  updatedAt: Date;
}
