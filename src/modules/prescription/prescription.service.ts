// In prescription.service.ts

import { Types } from "mongoose";
import { IPrescription, PrescriptionModel } from "./prescription.interface";
import { Prescription } from "./prescription.model";
import { FilterQuery } from "mongoose";

// Helper function to normalize ObjectId references
const normalizeId = (id: any): string | undefined => {
  if (!id) return undefined;
  if (id instanceof Types.ObjectId) return id.toString();
  if (typeof id === "string") return id;
  if (typeof id === "object" && id !== null && "_id" in id) {
    return id._id.toString();
  }
  return undefined;
};

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
      .populate("registered_doctor_id")
      .populate("appointment_id");
  },

  async getPrescription(id: string): Promise<PrescriptionModel | null> {
    return Prescription.findById(id)
      .populate("doctor_id")
      .populate("patient_id")
      .populate("registered_doctor_id")
      .populate("appointment_id");
  },

  async updatePrescription(
    id: string,
    payload: Partial<IPrescription>
  ): Promise<PrescriptionModel | null> {
    // Normalize all ID fields in payload
    const normalizedPayload: Partial<IPrescription> = {
      ...payload,
      appointment_id: normalizeId(payload.appointment_id),
      patient_id: normalizeId(payload.patient_id),
      doctor_id: normalizeId(payload.doctor_id),
      registered_doctor_id: normalizeId(payload.registered_doctor_id),
    };

    return Prescription.findByIdAndUpdate(id, normalizedPayload, { new: true });
  },

  async deletePrescription(id: string): Promise<PrescriptionModel | null> {
    return Prescription.findByIdAndDelete(id);
  },

  async getPrescriptionsByDoctor(doctor_id: string) {
    return Prescription.find({ doctor_id })
      .populate("patient_id")
      .populate("appointment_id")
      .populate("registered_doctor_id")
      .sort({ date: -1 });
  },

  async getPrescriptionsByRegisteredDoctor(registered_doctor_id: string) {
    return Prescription.find({ registered_doctor_id })
      .populate("patient_id")
      .populate("appointment_id")
      .populate("registered_doctor_id")
      .sort({ date: -1 });
  },
};
