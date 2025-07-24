import { Review } from "./review.model";
import { IReview, ReviewModel } from "./review.interface";
import { FilterQuery } from "mongoose";

export const ReviewService = {
  async createReview(payload: IReview): Promise<ReviewModel> {
    return await Review.create(payload);
  },

  async getReviews(filters: FilterQuery<IReview> = {}): Promise<ReviewModel[]> {
    return await Review.find(filters)
      .populate("doctor_id")
      .populate("patient_id")
      .sort({ createdAt: -1 });
  },

  async getReviewsByDoctor(doctor_id: string): Promise<ReviewModel[]> {
    return await Review.find({ doctor_id })
      .populate("patient_id")
      .sort({ createdAt: -1 });
  },

  async replyToReview(id: string, reply: string): Promise<ReviewModel | null> {
    return Review.findByIdAndUpdate(id, { reply }, { new: true });
  },
};
