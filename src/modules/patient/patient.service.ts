import { Patient } from "./patient.model";
import { IPatient, PatientModel } from "./patient.interface";
import { FilterQuery } from "mongoose";

export const PatientService = {
  async createPatient(payload: IPatient): Promise<PatientModel> {
    return await Patient.create(payload);
  },

  async getPatients(
    filters: FilterQuery<IPatient> = {}
  ): Promise<PatientModel[]> {
    return await Patient.find(filters);
  },

  async getPatient(id: string): Promise<PatientModel | null> {
    return Patient.findById(id);
  },

  async updatePatient(
    id: string,
    payload: Partial<IPatient>
  ): Promise<PatientModel | null> {
    return Patient.findByIdAndUpdate(id, payload, { new: true });
  },

  async deletePatient(id: string): Promise<PatientModel | null> {
    return Patient.findByIdAndDelete(id);
  },
};
