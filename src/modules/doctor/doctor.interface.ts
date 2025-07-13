// src/modules/doctor/doctor.interface.ts
import { Types, Document } from "mongoose";

export type TTimeSlot = {
  start_time_24hr: string;
  end_time_24hr: string;
  original_time: string;
};

export type TVisitingHours = {
  visiting_days: string[];
  visiting_hours: string[];
  closed_days: string[];
  original_text: string;
  time_slots: TTimeSlot[];
};

export type TChamber = {
  hospital_name: string;
  address: string;
  appointment_contact: string;
  visiting_hours: TVisitingHours;
  url: string;
};

// Main doctor type (for input/API)
export type TDoctor = {
  id: string;
  district: string;
  name: string;
  photo: string;
  degree: string;
  specialty: string;
  workplace: string;
  hospital_name: string;
  hospital_link: string;
  rating: string;
  chambers: TChamber[];
  profile_url: string;
  designation: string;
  source_hospital: string;
  specialtyList: string[];
  specialtyCategories: string[];
};

// Document interface (for MongoDB)
export interface IDoctorDocument extends Document {
  id?: string;
  district: string;
  name: string;
  photo: string;
  degree: string;
  specialty: string;
  workplace: string;
  hospital_name: string;
  hospital_link: string;
  rating: string;
  chambers: Types.ArraySubdocument<TChamber & Document>;
  profile_url: string;
  designation: string;
  source_hospital: string;
  specialtyList: Types.Array<string>;
  specialtyCategories: Types.Array<string>;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
