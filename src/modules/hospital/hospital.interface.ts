import { Types, Document } from "mongoose";

export interface IHospital {
  name: string;
  address: string;
  district: Types.ObjectId;
  contactNumbers: string[];
  googleMapUrl?: string;
  facilities?: string[];
  isDeleted?: boolean;
  latitude?: number;
  longitude?: number;
  geocodedAddressDetails?: {
    house_number?: string;
    road?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}

export interface HospitalModel extends Document, IHospital {
  createdAt: Date;
  updatedAt: Date;
}

export type IPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
