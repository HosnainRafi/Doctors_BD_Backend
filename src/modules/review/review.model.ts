import { Schema, model } from "mongoose";
import { ReviewModel } from "./review.interface";

const reviewSchema = new Schema<ReviewModel>(
  {
    doctor_id: {
      type: Schema.Types.ObjectId,
      ref: "RegisteredDoctor",
      required: true,
    },
    patient_id: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    reply: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export const Review = model<ReviewModel>("Review", reviewSchema);
