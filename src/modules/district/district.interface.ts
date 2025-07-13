// src/modules/district/district.interface.ts
import { Document } from "mongoose";
import { GeoJSON } from "geojson";

export interface IDistrict {
  name: string;
  slug: string;
  isActive?: boolean;
  geoBoundaries?: GeoJSON;
}

// Add this interface for input validation
export interface IDistrictInput {
  name: string;
  slug: string;
  isActive?: boolean;
  geoBoundaries?: GeoJSON;
}

export interface DistrictModel extends Document, IDistrict {
  createdAt: Date;
  updatedAt: Date;
}
