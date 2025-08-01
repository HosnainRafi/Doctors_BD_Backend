import { RegisteredDoctor } from "./registeredDoctor.model";
import {
  IRegisteredDoctor,
  RegisteredDoctorModel,
} from "./registeredDoctor.interface";
import { FilterQuery } from "mongoose";
import { Appointment } from "../appointment/appointment.model";

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

  async getDetailedEarnings(registered_doctor_id: string) {
    // Get all completed appointments for this doctor
    const completedAppointments = await Appointment.find({
      registered_doctor_id,
      status: "completed",
      amount: { $gt: 0 },
    }).populate("patient_id");

    // Calculate total earnings
    const totalEarnings = completedAppointments.reduce(
      (sum, appointment) => sum + (appointment.amount || 0),
      0
    );

    // Group appointments by month for monthly earnings
    const monthlyEarnings: { [key: string]: number } = {};

    completedAppointments.forEach((appointment) => {
      const date = new Date(appointment.createdAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      monthlyEarnings[monthKey] =
        (monthlyEarnings[monthKey] || 0) + (appointment.amount || 0);
    });

    // Calculate average appointment fee
    const averageFee =
      completedAppointments.length > 0
        ? totalEarnings / completedAppointments.length
        : 0;

    // Get current month's earnings
    const currentDate = new Date();
    const currentMonthKey = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }`;
    const currentMonthEarnings = monthlyEarnings[currentMonthKey] || 0;

    // Get today's earnings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayEarnings = completedAppointments
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.createdAt);
        return appointmentDate >= today && appointmentDate < tomorrow;
      })
      .reduce((sum, appointment) => sum + (appointment.amount || 0), 0);

    return {
      totalEarnings,
      currentMonthEarnings,
      todayEarnings,
      averageFee,
      appointmentCount: completedAppointments.length,
      monthlyBreakdown: monthlyEarnings,
      appointments: completedAppointments,
    };
  },
};
