import { Document } from "mongoose";

export interface IRegisteredDoctor {
  name: string;
  email: string;
  phone: string;
  password: string; // hashed
  bmdc_number?: string;
  specialty?: string;
  photo?: string;
  bio?: string;
  isVerified?: boolean;
  isOnline?: boolean;
  availableSlots?: Array<{ date: string; time: string }>;
  blockedSlots?: Array<{ date: string; time: string }>;
  comparePassword?(password: string): Promise<boolean>;

  // Add more fields as needed
}

export interface RegisteredDoctorModel extends Document, IRegisteredDoctor {
  createdAt: Date;
  updatedAt: Date;
}
