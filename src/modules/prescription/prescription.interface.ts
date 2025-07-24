import { Document, Types } from "mongoose";

export interface IMedicine {
  name: string;
  timing: string; // <-- new field for ১+০+১
  duration: string; // <-- new field for 10 days
  instructions?: string; // <-- for extra instructions
}

export interface IPrescription {
  appointment_id: Types.ObjectId | string;
  patient_id: Types.ObjectId | string;
  doctor_id?: Types.ObjectId | string; // directory
  registered_doctor_id?: Types.ObjectId | string; // online
  date: string;
  medicines: IMedicine[];
  advice?: string;
  follow_up_date?: string;
  pdf_url?: string;
  chief_complaints?: string[];
}

export interface PrescriptionModel extends Document, IPrescription {
  createdAt: Date;
  updatedAt: Date;
}
