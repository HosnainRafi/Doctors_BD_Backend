import { Hospital } from "./hospital.model";
import {
  IHospital,
  HospitalModel,
  IPaginationOptions,
} from "./hospital.interface";
import { FilterQuery, Types } from "mongoose";
import { calculatePagination } from "../../shared/calculatePagination";

export const HospitalService = {
  async createHospital(payload: IHospital): Promise<HospitalModel> {
    return await Hospital.create(payload);
  },

  async getHospitals(
    filters: FilterQuery<IHospital>,
    options: IPaginationOptions
  ) {
    const { limit, page, skip } = calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
      andConditions.push({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { address: { $regex: searchTerm, $options: "i" } },
        ],
      });
    }

    if (Object.keys(filterData).length > 0) {
      andConditions.push({
        $and: Object.entries(filterData).map(([field, value]) => ({
          [field]: value,
        })),
      });
    }

    const whereCondition =
      andConditions.length > 0 ? { $and: andConditions } : {};

    const [hospitals, total] = await Promise.all([
      Hospital.find(whereCondition)
        .populate("district", "name slug")
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
      meta: {
        page,
        limit,
        total,
      },
      data: hospitals,
    };
  },

  async getHospital(id: string): Promise<HospitalModel | null> {
    return Hospital.findById(id).populate("district", "name slug");
  },

  async updateHospital(
    id: string,
    payload: Partial<IHospital>
  ): Promise<HospitalModel | null> {
    return Hospital.findByIdAndUpdate(id, payload, { new: true });
  },

  async deleteHospital(id: string): Promise<HospitalModel | null> {
    return Hospital.findByIdAndDelete(id);
  },
};
