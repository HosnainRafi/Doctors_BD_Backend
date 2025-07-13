// src/modules/district/district.service.ts
import { District } from "./district.model";
import { IDistrict, IDistrictInput, DistrictModel } from "./district.interface"; // Make sure to import IDistrictInput
import { FilterQuery } from "mongoose";

export const DistrictService = {
  // Update the parameter type to use IDistrictInput
  createDistrict: async (payload: IDistrictInput) => {
    return await District.create(payload);
  },

  // Other service methods...
  getAllDistricts: async (filters: FilterQuery<IDistrict> = {}) => {
    return await District.find(filters);
  },
  // ... rest of your service methods
};
