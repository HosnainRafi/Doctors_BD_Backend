import { Appointment } from "./appointment.model";
import { IAppointment, AppointmentModel } from "./appointment.interface";
import mongoose, { FilterQuery } from "mongoose";
import { sendEmail } from "../../app/utils/sendEmail";
import { RegisteredDoctor } from "../registeredDoctor/registeredDoctor.model";

export const AppointmentService = {
  async createAppointment(payload: IAppointment): Promise<AppointmentModel> {
    // Ensure we are booking for a registered doctor with a profile
    if (!payload.registered_doctor_id) {
      throw new Error(
        "Registered Doctor ID is required to book a paid appointment."
      );
    }

    // Fetch the doctor's details to get consultation fees
    const doctor = await RegisteredDoctor.findById(
      payload.registered_doctor_id
    );
    if (!doctor || !doctor.consultation) {
      throw new Error("Doctor's consultation details not found.");
    }

    const consultation = doctor.consultation;
    let isFollowUp = false;
    let fee = 0;

    // --- Fee Calculation Logic ---

    // 1. Determine if it's a follow-up appointment
    if (
      consultation.follow_up_within_day &&
      consultation.follow_up_within_day > 0
    ) {
      const followUpCutoffDate = new Date();
      followUpCutoffDate.setDate(
        followUpCutoffDate.getDate() - consultation.follow_up_within_day
      );

      const lastAppointment = await Appointment.findOne({
        registered_doctor_id: payload.registered_doctor_id,
        patient_id: payload.patient_id,
        status: "completed",
        createdAt: { $gte: followUpCutoffDate },
      });

      if (lastAppointment) {
        isFollowUp = true;
      }
    }

    // 2. Calculate the fee based on appointment type and discounts
    const now = new Date();

    if (isFollowUp) {
      const discountExpires = consultation.follow_up_fee_discount_expire
        ? new Date(consultation.follow_up_fee_discount_expire)
        : null;

      if (
        consultation.follow_up_fee_discount_with_vat &&
        discountExpires &&
        discountExpires > now
      ) {
        fee = consultation.follow_up_fee_discount_with_vat;
      } else {
        fee = consultation.follow_up_fee_with_vat || 0;
      }
    } else {
      // It's a standard (new) appointment
      const discountExpires = consultation.standard_fee_discount_expire
        ? new Date(consultation.standard_fee_discount_expire)
        : null;

      if (
        consultation.standard_fee_discount_with_vat &&
        discountExpires &&
        discountExpires > now
      ) {
        fee = consultation.standard_fee_discount_with_vat;
      } else {
        fee = consultation.standard_fee_with_vat || 0;
      }
    }

    if (fee <= 0) {
      throw new Error(
        "Could not determine a valid consultation fee for the doctor."
      );
    }

    // Set the calculated amount and status on the payload
    payload.amount = fee;
    payload.status = "pending_payment";

    // Create the appointment with the dynamic data
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

  async getEarningsByDoctor(registered_doctor_id: string) {
    const completedAppointments = await Appointment.find({
      registered_doctor_id,
      status: "completed",
      amount: { $gt: 0 },
    });

    const totalEarnings = completedAppointments.reduce(
      (sum, appointment) => sum + (appointment.amount || 0),
      0
    );

    return {
      total: totalEarnings,
      count: completedAppointments.length,
      appointments: completedAppointments,
    };
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

  // New method to update appointment status after payment
  async updateAppointmentStatusAfterPayment(
    appointmentId: string,
    status: "confirmed" | "cancelled"
  ): Promise<AppointmentModel | null> {
    return Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );
  },
};
