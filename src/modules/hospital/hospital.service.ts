import { Hospital } from "./hospital.model";
import {
  IHospital,
  IPaginationOptions,
  HospitalModel,
} from "./hospital.interface";
import { FilterQuery } from "mongoose";
import { calculatePagination } from "../../shared/calculatePagination";
import { District } from "../district/district.model";

export const HospitalService = {
  async createHospital(payload: IHospital): Promise<HospitalModel> {
    return await Hospital.create(payload);
  },

  async getHospitals(
    filters: FilterQuery<IHospital>,
    options: IPaginationOptions
  ): Promise<{
    meta: { page: number; limit: number; total: number };
    data: HospitalModel[];
  }> {
    const { limit, page, skip } = calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions: any[] = [{ isDeleted: false }];

    if (searchTerm) {
      andConditions.push({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { address: { $regex: searchTerm, $options: "i" } },
        ],
      });
    }

    Object.entries(filterData).forEach(([field, value]) => {
      andConditions.push({ [field]: value });
    });

    const whereCondition =
      andConditions.length > 0 ? { $and: andConditions } : {};

    const [hospitals, total] = await Promise.all([
      Hospital.find(whereCondition)
        .skip(skip)
        .limit(limit)
        .sort(
          options.sortBy
            ? { [options.sortBy]: options.sortOrder === "asc" ? 1 : -1 }
            : {}
        ),
      Hospital.countDocuments(whereCondition),
    ]);

    return {
      meta: { page, limit, total },
      data: hospitals,
    };
  },

  async getHospital(id: string): Promise<HospitalModel | null> {
    return Hospital.findOne({ _id: id, isDeleted: false });
  },

  async updateHospital(
    id: string,
    payload: Partial<IHospital>
  ): Promise<HospitalModel | null> {
    return Hospital.findByIdAndUpdate(id, payload, { new: true });
  },

  async deleteHospital(id: string): Promise<HospitalModel | null> {
    return Hospital.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  },

  // New: Get all doctors for a hospital (assuming doctorIds is in hospital)
  async getHospitalDoctors(id: string) {
    const hospital = await Hospital.findOne({ _id: id, isDeleted: false });
    if (!hospital || !hospital.doctorIds || !hospital.doctorIds.length)
      return [];
    // Import Doctor model here or at the top
    const { Doctor } = require("../doctor/doctor.model");
    return Doctor.find({ _id: { $in: hospital.doctorIds }, isDeleted: false });
  },

  async getHospitalsByDistrictName(districtName: string) {
    // Find the district by name (case-insensitive)
    const district = await District.findOne({
      name: { $regex: `^${districtName}$`, $options: "i" },
    });
    if (!district) return [];
    // Find hospitals with matching district_id
    return Hospital.find({
      district_id: district.id,
      isDeleted: false,
    });
  },
};
