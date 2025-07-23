import { FollowUp } from "./followup.model";
import { IFollowUp, FollowUpModel } from "./followup.interface";
import { FilterQuery } from "mongoose";

export const FollowUpService = {
  async createFollowUp(payload: IFollowUp): Promise<FollowUpModel> {
    return await FollowUp.create(payload);
  },

  async getFollowUps(
    filters: FilterQuery<IFollowUp> = {}
  ): Promise<FollowUpModel[]> {
    return await FollowUp.find(filters)
      .populate("doctor_id")
      .populate("patient_id")
      .populate("appointment_id");
  },

  async getFollowUp(id: string): Promise<FollowUpModel | null> {
    return FollowUp.findById(id)
      .populate("doctor_id")
      .populate("patient_id")
      .populate("appointment_id");
  },

  async updateFollowUp(
    id: string,
    payload: Partial<IFollowUp>
  ): Promise<FollowUpModel | null> {
    return FollowUp.findByIdAndUpdate(id, payload, { new: true });
  },

  async deleteFollowUp(id: string): Promise<FollowUpModel | null> {
    return FollowUp.findByIdAndDelete(id);
  },

  async getFollowUpsByDoctor(doctor_id: string) {
    return FollowUp.find({ doctor_id })
      .populate("patient_id")
      .populate("appointment_id")
      .sort({ scheduled_date: -1 });
  },

  async getFollowUpsByRegisteredDoctor(registered_doctor_id: string) {
    return FollowUp.find({ registered_doctor_id })
      .populate("patient_id")
      .populate("appointment_id")
      .sort({ scheduled_date: -1 });
  },
};
