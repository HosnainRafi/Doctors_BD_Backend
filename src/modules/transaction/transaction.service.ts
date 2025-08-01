import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";
import { Appointment } from "../appointment/appointment.model";
import mongoose from "mongoose";
import { SSLCommerzConfig } from "../../config/sslcommerz";

// Helper function remains the same
const getPatientInfo = (patient: any) => {
  if (!patient) {
    return {
      name: "Patient",
      email: "patient@example.com",
      address: "N/A",
      phone: "N/A",
    };
  }
  if (typeof patient === "object" && patient !== null) {
    return {
      name: patient.name || "Patient",
      email: patient.email || "patient@example.com",
      address: patient.address || "N/A",
      phone: patient.phone || "N/A",
    };
  }
  return {
    name: "Patient",
    email: "patient@example.com",
    address: "N/A",
    phone: "N/A",
  };
};

export const TransactionService = {
  async initiatePayment(appointmentId: string) {
    if (!appointmentId) {
      throw new Error("Appointment ID is required");
    }

    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(appointmentId);
    } catch (error) {
      throw new Error("Invalid appointment ID format");
    }

    // Fetch appointment with populated doctor information
    const appointment = await Appointment.findById(objectId)
      .populate("patient_id")
      .populate("registered_doctor_id")
      .populate("doctor_id");

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.status === "confirmed") {
      throw new Error("Payment already completed for this appointment");
    }

    // Get the doctor's consultation fee
    let amount = 500; // Default fallback amount

    // Check if it's a registered doctor appointment
    if (appointment.registered_doctor_id) {
      const doctor = appointment.registered_doctor_id as any;
      if (
        doctor.consultation &&
        doctor.consultation.follow_up_fee_discount_with_vat
      ) {
        amount = doctor.consultation.follow_up_fee_discount_with_vat;
      }
    }
    // If it's a directory doctor, you might want to implement similar logic
    else if (appointment.doctor_id) {
      // For directory doctors, you might have a different fee structure
      // For now, we'll keep the default amount
      console.log("Using default amount for directory doctor");
    }

    // Update the appointment with the amount
    await Appointment.findByIdAndUpdate(objectId, { amount });

    // Create a unique transaction ID
    const transactionId = `${objectId.toString()}-${Date.now()}`;

    // Get patient information
    const patientInfo = getPatientInfo(appointment.patient_id);

    // Prepare payment data for SSLCommerz
    const data = {
      total_amount: amount,
      currency: "BDT",
      tran_id: transactionId,
      success_url: SSLCommerzConfig.success_url,
      fail_url: SSLCommerzConfig.fail_url,
      cancel_url: SSLCommerzConfig.cancel_url,
      ipn_url: SSLCommerzConfig.ipn_url,
      shipping_method: "NO",
      product_name: "Appointment Booking",
      product_category: "Service",
      product_profile: "service",
      cus_name: patientInfo.name,
      cus_email: patientInfo.email,
      cus_add1: patientInfo.address,
      cus_add2: "N/A",
      cus_city: "N/A",
      cus_state: "N/A",
      cus_postcode: "N/A",
      cus_country: "Bangladesh",
      cus_phone: patientInfo.phone,
      ship_name: patientInfo.name,
      ship_add1: patientInfo.address,
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: "N/A",
      ship_country: "Bangladesh",
      value_a: appointmentId,
    };

    try {
      const SSLCommerzPayment = require("sslcommerz-lts");
      if (!SSLCommerzPayment || typeof SSLCommerzPayment !== "function") {
        throw new Error(
          "Failed to load the SSLCommerzPayment library correctly."
        );
      }

      const sslcz = new SSLCommerzPayment(
        SSLCommerzConfig.store_id,
        SSLCommerzConfig.store_password,
        SSLCommerzConfig.is_live
      );

      const apiResponse = await sslcz.init(data);

      // Create transaction record
      await Transaction.create({
        appointment_id: objectId,
        amount,
        tran_id: transactionId,
        status: "pending",
      });

      return {
        GatewayPageURL: apiResponse.GatewayPageURL,
        transactionId,
        amount, // Include amount in the response
      };
    } catch (error: any) {
      console.error("SSLCommerz initialization error:", error);
      throw new Error(`Failed to initialize payment gateway: ${error.message}`);
    }
  },

  // This function remains the same as it was already well-structured.
  async updateTransactionStatus(
    tran_id: string,
    status: "completed" | "failed" | "cancelled"
  ) {
    const transaction = await Transaction.findOne({ tran_id });

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Prevent updating already completed transactions
    if (transaction.status === "completed") {
      return transaction;
    }

    transaction.status = status;
    await transaction.save();

    if (status === "completed") {
      await Appointment.findByIdAndUpdate(transaction.appointment_id, {
        status: "confirmed",
      });
    } else {
      await Appointment.findByIdAndUpdate(transaction.appointment_id, {
        status: "cancelled",
      });
    }

    return transaction;
  },

  async getTransactionByTranId(tran_id: string) {
    return Transaction.findOne({ tran_id }).populate({
      path: "appointment_id",
      populate: [
        { path: "patient_id" },
        { path: "doctor_id" },
        { path: "registered_doctor_id" },
        { path: "chamber_id" },
      ],
    });
  },
};
