import { Schema, model } from "mongoose";
import { SpecialtyCategoryModel } from "./specialtyCategory.interface";

const specialtyCategorySchema = new Schema<SpecialtyCategoryModel>(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true, versionKey: false }
);

export const SpecialtyCategory = model<SpecialtyCategoryModel>(
  "SpecialtyCategory",
  specialtyCategorySchema,
  "specialtycategories" // Explicit collection name
);
