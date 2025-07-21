import { Document } from "mongoose";

export interface ISpecialtyCategory {
  name: string;
}

export interface SpecialtyCategoryModel extends Document, ISpecialtyCategory {}
