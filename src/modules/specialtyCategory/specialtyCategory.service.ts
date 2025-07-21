import { SpecialtyCategory } from "./specialtyCategory.model";
import {
  ISpecialtyCategory,
  SpecialtyCategoryModel,
} from "./specialtyCategory.interface";
import { FilterQuery } from "mongoose";

export const SpecialtyCategoryService = {
  async create(payload: ISpecialtyCategory): Promise<SpecialtyCategoryModel> {
    return await SpecialtyCategory.create(payload);
  },

  async getAll(
    filters: FilterQuery<ISpecialtyCategory> = {},
    options: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {}
  ) {
    const page = options.page || 1;
    const limit = options.limit || 100;
    const skip = (page - 1) * limit;
    const sort: any = options.sortBy
      ? { [options.sortBy]: options.sortOrder === "asc" ? 1 : -1 }
      : {};

    const [categories, total] = await Promise.all([
      SpecialtyCategory.find(filters).skip(skip).limit(limit).sort(sort),
      SpecialtyCategory.countDocuments(filters),
    ]);

    return {
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      data: categories,
    };
  },

  async getById(id: string): Promise<SpecialtyCategoryModel | null> {
    return SpecialtyCategory.findById(id);
  },

  async update(
    id: string,
    payload: Partial<ISpecialtyCategory>
  ): Promise<SpecialtyCategoryModel | null> {
    return SpecialtyCategory.findByIdAndUpdate(id, payload, { new: true });
  },

  async delete(id: string): Promise<SpecialtyCategoryModel | null> {
    return SpecialtyCategory.findByIdAndDelete(id);
  },
};
