import { Hospital } from "./hospital.model";
import { IHospital, HospitalModel } from "./hospital.interface";
import { FilterQuery } from "mongoose";

export const HospitalService = {
  createHospital: async (payload: IHospital): Promise<HospitalModel> => {
    return await Hospital.create(payload);
  },

  getHospitals: async (
    filters: FilterQuery<IHospital> = {}
  ): Promise<HospitalModel[]> => {
    return await Hospital.find(filters).populate("district", "name slug");
  },

  getSingleHospital: async (id: string): Promise<HospitalModel | null> => {
    return await Hospital.findById(id).populate("district", "name slug");
  },

  updateHospital: async (
    id: string,
    payload: Partial<IHospital>
  ): Promise<HospitalModel | null> => {
    return await Hospital.findByIdAndUpdate(id, payload, { new: true });
  },

  deleteHospital: async (id: string): Promise<HospitalModel | null> => {
    return await Hospital.findByIdAndDelete(id);
  },
};
