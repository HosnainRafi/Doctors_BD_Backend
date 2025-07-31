import { Document, Types } from "mongoose";

export interface IAppointment {
  // For public directory doctor (offline)
  doctor_id?: Types.ObjectId | string;
  // For registered/online doctor
  registered_doctor_id?: Types.ObjectId | string;
  patient_id: Types.ObjectId | string;
  chamber_id?: Types.ObjectId | string;
  date: string;
  time: string;
  status?:
    | "pending"
    | "confirmed"
    | "cancelled"
    | "completed"
    | "pending_payment";
  reason?: string;
  user_id: Types.ObjectId | string;
  isActive?: boolean;
  amount?: number; // e.g. 500 (in BDT)
}

export interface AppointmentModel extends Document, IAppointment {
  createdAt: Date;
  updatedAt: Date;
}
