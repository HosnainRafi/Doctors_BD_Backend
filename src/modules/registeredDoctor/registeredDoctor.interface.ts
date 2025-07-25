import { Document } from "mongoose";

export interface ISchedule {
  visiting_method: string;
  visiting_day: string;
  from_time: string;
  to_time: string;
}

export interface IExperience {
  organization_name: string;
  designation: string;
  department?: string;
  from: string;
  to?: string | null;
  is_current?: boolean;
  duration_month?: number;
}

export interface IConsultation {
  standard_fee: number;
  standard_fee_with_vat: number;
  standard_fee_discount?: number;
  standard_fee_discount_with_vat?: number;
  standard_fee_discount_expire?: string;
  follow_up_fee?: number;
  follow_up_fee_with_vat?: number;
  follow_up_fee_discount?: number;
  follow_up_fee_discount_with_vat?: number;
  follow_up_fee_discount_expire?: string;
  follow_up_within_day?: number;
  average_waiting_minutes?: number;
  average_consultation_minutes?: number;
}

export interface IRegisteredDoctor {
  name: string;
  email: string;
  phone: string;
  password: string;
  bmdc_number?: string;
  specialty?: string;
  specialties?: string[]; // e.g. ["Cardiology", "General Physician"]
  degree_names?: string[]; // e.g. ["MBBS", "FCPS"]
  additional_qualifications?: string[];
  photo?: string;
  bio?: string;
  isVerified?: boolean;
  isOnline?: boolean;
  availableSlots?: Array<{ date: string; time: string }>;
  blockedSlots?: Array<{ date: string; time: string }>;
  schedules?: ISchedule[];
  consultation?: IConsultation;
  experiences?: IExperience[];
  no_of_patients_served?: number;
  review?: {
    average_rating: number;
    total_reviews: number;
  };
  comparePassword?(password: string): Promise<boolean>;
}

export interface RegisteredDoctorModel extends Document, IRegisteredDoctor {
  createdAt: Date;
  updatedAt: Date;
}
