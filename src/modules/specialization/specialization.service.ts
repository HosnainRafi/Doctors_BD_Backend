import { Specialization } from "./specialization.model";
import {
  ISpecialization,
  SpecializationModel,
} from "./specialization.interface";
import { FilterQuery } from "mongoose";

export const SpecializationService = {
  async createSpecialization(
    payload: ISpecialization
  ): Promise<SpecializationModel> {
    return await Specialization.create(payload);
  },

  async getSpecializations(
    filters: FilterQuery<ISpecialization> = {}
  ): Promise<SpecializationModel[]> {
    return await Specialization.find(filters);
  },

  async searchSpecializations(query: string): Promise<SpecializationModel[]> {
    return await Specialization.find({
      $text: { $search: query },
    });
  },

  // Add update, delete methods as needed
};
