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

    const appointment = await Appointment.findById(objectId).populate(
      "patient_id"
    );

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.status === "confirmed") {
      throw new Error("Payment already completed for this appointment");
    }

    // IMPROVEMENT: Create a more robust and unique transaction ID.
    const transactionId = `${objectId.toString()}-${Date.now()}`;

    // IMPROVEMENT: This amount should ideally be dynamic, fetched from doctor's profile or appointment data.
    const amount = 500;

    const patientInfo = getPatientInfo(appointment.patient_id);

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
      // SSLCommerz allows custom fields. Using value_a to hold the appointmentId
      // is a good way to pass data that you can receive back in the IPN.
      value_a: appointmentId,
    };

    // REFACTORED: Removed the `new Promise` anti-pattern for cleaner async/await.
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

      // The rest of the logic can now use the `new Promise` wrapper, or the refactored async/await version from my previous answer.
      // Using the cleaner async/await version:
      const apiResponse = await sslcz.init(data);

      await Transaction.create({
        appointment_id: objectId,
        amount,
        tran_id: transactionId,
        status: "pending",
      });

      return {
        GatewayPageURL: apiResponse.GatewayPageURL,
        transactionId,
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
    return Transaction.findOne({ tran_id });
  },
};
