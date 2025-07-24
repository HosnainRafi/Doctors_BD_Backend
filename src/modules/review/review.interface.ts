import { Document, Types } from "mongoose";

export interface IReview {
  doctor_id: Types.ObjectId | string; // RegisteredDoctor
  patient_id: Types.ObjectId | string;
  rating: number; // 1-5
  comment?: string;
  reply?: string;
}

export interface ReviewModel extends Document, IReview {
  createdAt: Date;
  updatedAt: Date;
}
