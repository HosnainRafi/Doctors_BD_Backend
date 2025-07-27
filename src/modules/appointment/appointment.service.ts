import { Appointment } from "./appointment.model";
import { IAppointment, AppointmentModel } from "./appointment.interface";
import mongoose, { FilterQuery } from "mongoose";
import { sendEmail } from "../../app/utils/sendEmail";

export const AppointmentService = {
  async createAppointment(payload: IAppointment): Promise<AppointmentModel> {
    return await Appointment.create(payload);
  },

  async getAppointments(
    filters: FilterQuery<IAppointment> = {}
  ): Promise<AppointmentModel[]> {
    if (filters.user_id && typeof filters.user_id === "string") {
      filters.user_id = new mongoose.Types.ObjectId(filters.user_id);
    }
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

  // appointment.service.ts
  async getEarningsByDoctor(registered_doctor_id: string) {
    const completed = await Appointment.find({
      registered_doctor_id,
      status: "completed",
      amount: { $gt: 0 },
    });
    const total = completed.reduce((sum, a) => sum + (a.amount || 0), 0);
    return { total, count: completed.length, appointments: completed };
  },

  async sendReminder(appointmentId: string) {
    const appointment = await Appointment.findById(appointmentId)
      .populate("patient_id")
      .populate("doctor_id")
      .populate("registered_doctor_id");

    if (!appointment) throw new Error("Appointment not found");

    const patient = appointment.patient_id as any;
    const doctor = (appointment.registered_doctor_id ||
      appointment.doctor_id) as any;

    // WhatsApp reminder
    // if (patient && patient.phone) {
    //   await sendWhatsapp(
    //     patient.phone,
    //     `Reminder: You have an appointment with Dr. ${
    //       doctor?.name || doctor?._id
    //     } on ${appointment.date} at ${appointment.time}.`
    //   );
    // }

    // Email reminder (optional)
    if (patient && patient.email) {
      await sendEmail(
        patient.email,
        "Appointment Reminder",
        `This is a reminder for your appointment with Dr. ${
          doctor?.name || doctor?._id
        } on ${appointment.date} at ${appointment.time}.`
      );
    }

    return { success: true };
  },
};
