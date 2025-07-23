import { Document, Types } from "mongoose";

export interface IFollowUp {
  appointment_id: Types.ObjectId | string;
  patient_id: Types.ObjectId | string;
  doctor_id?: Types.ObjectId | string; // directory
  registered_doctor_id?: Types.ObjectId | string; // online
  scheduled_date: string;
  status?: "pending" | "completed" | "cancelled";
  notes?: string;
}

export interface FollowUpModel extends Document, IFollowUp {
  createdAt: Date;
  updatedAt: Date;
}
