import { Document, Types } from "mongoose";

export interface IHospital {
  name: string;
  address: string;
  district: Types.ObjectId;
  contactNumbers: string[];
  googleMapUrl?: string;
  facilities?: string[];
  isActive?: boolean;
}

export interface HospitalModel extends Document, IHospital {
  createdAt: Date;
  updatedAt: Date;
}
