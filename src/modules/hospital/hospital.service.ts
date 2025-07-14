import { Hospital } from "./hospital.model";
import {
  IHospital,
  IPaginationOptions,
  HospitalModel,
} from "./hospital.interface";
import { FilterQuery } from "mongoose";
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

    const andConditions: any[] = [{ isDeleted: false }]; // Default filter

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
    console.log(
      "Final whereCondition:",
      JSON.stringify(whereCondition, null, 2)
    );
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
};
