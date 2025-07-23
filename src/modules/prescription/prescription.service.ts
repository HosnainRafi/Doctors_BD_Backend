import { Prescription } from "./prescription.model";
import { IPrescription, PrescriptionModel } from "./prescription.interface";
import { FilterQuery } from "mongoose";

export const PrescriptionService = {
  async createPrescription(payload: IPrescription): Promise<PrescriptionModel> {
    return await Prescription.create(payload);
  },

  async getPrescriptions(
    filters: FilterQuery<IPrescription> = {}
  ): Promise<PrescriptionModel[]> {
    return await Prescription.find(filters)
      .populate("doctor_id")
      .populate("patient_id")
      .populate("appointment_id");
  },

  async getPrescription(id: string): Promise<PrescriptionModel | null> {
    return Prescription.findById(id)
      .populate("doctor_id")
      .populate("patient_id")
      .populate("appointment_id");
  },

  async updatePrescription(
    id: string,
    payload: Partial<IPrescription>
  ): Promise<PrescriptionModel | null> {
    return Prescription.findByIdAndUpdate(id, payload, { new: true });
  },

  async deletePrescription(id: string): Promise<PrescriptionModel | null> {
    return Prescription.findByIdAndDelete(id);
  },
  async getPrescriptionsByDoctor(doctor_id: string) {
    return Prescription.find({ doctor_id })
      .populate("patient_id")
      .populate("appointment_id")
      .sort({ date: -1 });
  },

  async getPrescriptionsByRegisteredDoctor(registered_doctor_id: string) {
    return Prescription.find({ registered_doctor_id })
      .populate("patient_id")
      .populate("appointment_id")
      .sort({ date: -1 });
  },
};
