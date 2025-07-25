import { RegisteredDoctor } from "./registeredDoctor.model";
import {
  IRegisteredDoctor,
  RegisteredDoctorModel,
} from "./registeredDoctor.interface";
import { FilterQuery } from "mongoose";

export const RegisteredDoctorService = {
  async createDoctor(
    payload: IRegisteredDoctor
  ): Promise<RegisteredDoctorModel> {
    return await RegisteredDoctor.create(payload);
  },

  async getDoctors(
    filters: FilterQuery<IRegisteredDoctor> = {}
  ): Promise<RegisteredDoctorModel[]> {
    return await RegisteredDoctor.find(filters);
  },

  async getDoctor(id: string): Promise<RegisteredDoctorModel | null> {
    return RegisteredDoctor.findById(id);
  },

  async getDoctorByEmail(email: string): Promise<RegisteredDoctorModel | null> {
    return RegisteredDoctor.findOne({ email });
  },

  async updateDoctor(
    id: string,
    payload: Partial<IRegisteredDoctor>
  ): Promise<RegisteredDoctorModel | null> {
    return RegisteredDoctor.findByIdAndUpdate(id, payload, { new: true });
  },

  async deleteDoctor(id: string): Promise<RegisteredDoctorModel | null> {
    return RegisteredDoctor.findByIdAndDelete(id);
  },

  async login(email: string, password: string) {
    const doctor = (await RegisteredDoctor.findOne({ email })) as InstanceType<
      typeof RegisteredDoctor
    >;
    if (!doctor) throw new Error("Doctor not found");
    if (typeof doctor.comparePassword !== "function") {
      throw new Error("comparePassword method not found on doctor");
    }
    const isMatch = await doctor.comparePassword(password);
    if (!isMatch) throw new Error("Invalid credentials");
    return doctor;
  },
};
