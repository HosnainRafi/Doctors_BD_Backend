import { Appointment } from "./appointment.model";
import { IAppointment, AppointmentModel } from "./appointment.interface";
import { FilterQuery } from "mongoose";

export const AppointmentService = {
  async createAppointment(payload: IAppointment): Promise<AppointmentModel> {
    return await Appointment.create(payload);
  },

  async getAppointments(
    filters: FilterQuery<IAppointment> = {}
  ): Promise<AppointmentModel[]> {
    return await Appointment.find(filters)
      .populate("doctor_id")
      .populate("registered_doctor_id")
      .populate("patient_id")
      .populate("chamber_id");
  },

  async getAppointment(id: string): Promise<AppointmentModel | null> {
    return Appointment.findById(id)
      .populate("doctor_id")
      .populate("registered_doctor_id")
      .populate("patient_id")
      .populate("chamber_id");
  },

  // For directory doctor dashboard (if needed)
  async getAppointmentsByDoctor(doctor_id: string) {
    return Appointment.find({ doctor_id })
      .populate("patient_id")
      .populate("chamber_id")
      .sort({ date: -1, time: -1 });
  },

  // For registered doctor dashboard
  async getAppointmentsByRegisteredDoctor(registered_doctor_id: string) {
    return Appointment.find({ registered_doctor_id })
      .populate("patient_id")
      .populate("chamber_id")
      .sort({ date: -1, time: -1 });
  },

  async updateAppointment(
    id: string,
    payload: Partial<IAppointment>
  ): Promise<AppointmentModel | null> {
    return Appointment.findByIdAndUpdate(id, payload, { new: true });
  },

  async deleteAppointment(id: string): Promise<AppointmentModel | null> {
    return Appointment.findByIdAndDelete(id);
  },
};
