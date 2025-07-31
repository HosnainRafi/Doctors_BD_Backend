import { z } from "zod";

export const initiatePaymentValidation = z.object({
  // This remains empty as the appointment ID is passed via URL params, not the body.
});

// This schema remains correct for its purpose.
export const paymentStatusUpdateValidation = z.object({
  tran_id: z.string().min(1, "Transaction ID is required"),
  status: z.enum(["completed", "failed", "cancelled"]),
});

export const appointmentStatusUpdateValidation = z.object({
  body: z.object({
    status: z.enum(["confirmed", "cancelled"], {
      message: "Invalid status. Must be either 'confirmed' or 'cancelled'.",
    }),
  }),
});

export const TransactionValidations = {
  initiatePaymentValidation,
  paymentStatusUpdateValidation,
  appointmentStatusUpdateValidation, // The corrected validation
};
