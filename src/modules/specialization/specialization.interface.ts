import { Document, Types } from "mongoose";

export interface ISpecialization {
  name: string;
  description?: string;
  icon?: string;
  category?: string;
  relatedDiseases?: string[];
}

export interface SpecializationModel extends Document, ISpecialization {
  createdAt: Date;
  updatedAt: Date;
}
