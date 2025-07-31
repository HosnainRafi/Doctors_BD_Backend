import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { SSLCommerzConfig } from "../../config/sslcommerz";
import { AppointmentService } from "../appointment/appointment.service";
import { Appointment } from "../appointment/appointment.model";

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await TransactionService.initiatePayment(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment initiated successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: error.message || "Failed to initiate payment",
      data: null,
    });
  }
});

const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
  // FIXED: Read from req.body instead of req.query
  const { tran_id } = req.body;

  if (!tran_id) {
    // Redirect to a failure page if the transaction ID is missing from the callback
    return res.redirect(
      `${SSLCommerzConfig.frontend_fail_url}?error=missing_transaction_id`
    );
  }

  try {
    // This part remains the same
    await TransactionService.updateTransactionStatus(
      tran_id as string,
      "completed"
    );
    // This redirect is correct. It constructs a GET URL for your frontend.
    res.redirect(`${SSLCommerzConfig.frontend_success_url}?tran_id=${tran_id}`);
  } catch (error) {
    console.error("Payment success processing error:", error);
    res.redirect(
      `${SSLCommerzConfig.frontend_fail_url}?tran_id=${tran_id}&error=processing_failed`
    );
  }
});

const paymentFail = catchAsync(async (req: Request, res: Response) => {
  // FIXED: Read from req.body instead of req.query
  const { tran_id } = req.body;

  if (!tran_id) {
    return res.redirect(
      `${SSLCommerzConfig.frontend_fail_url}?error=missing_transaction_id`
    );
  }

  try {
    await TransactionService.updateTransactionStatus(
      tran_id as string,
      "failed"
    );
    res.redirect(`${SSLCommerzConfig.frontend_fail_url}?tran_id=${tran_id}`);
  } catch (error) {
    console.error("Payment fail processing error:", error);
    res.redirect(
      `${SSLCommerzConfig.frontend_fail_url}?tran_id=${tran_id}&error=processing_failed`
    );
  }
});

const paymentCancel = catchAsync(async (req: Request, res: Response) => {
  // FIXED: Read from req.body instead of req.query
  const { tran_id } = req.body;

  if (!tran_id) {
    return res.redirect(
      `${SSLCommerzConfig.frontend_cancel_url}?error=missing_transaction_id`
    );
  }

  try {
    await TransactionService.updateTransactionStatus(
      tran_id as string,
      "cancelled"
    );
    res.redirect(`${SSLCommerzConfig.frontend_cancel_url}?tran_id=${tran_id}`);
  } catch (error) {
    console.error("Payment cancel processing error:", error);
    res.redirect(
      `${SSLCommerzConfig.frontend_cancel_url}?tran_id=${tran_id}&error=processing_failed`
    );
  }
});

const paymentIpn = catchAsync(async (req: Request, res: Response) => {
  const { tran_id, status } = req.body;

  try {
    if (status === "VALID") {
      await TransactionService.updateTransactionStatus(tran_id, "completed");
    } else {
      await TransactionService.updateTransactionStatus(tran_id, "failed");
    }
    res.send({ success: true });
  } catch (error: any) {
    console.error("IPN error:", error);
    res.send({ success: false, error: error.message });
  }
});
const updateAppointmentStatusAfterPayment = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["confirmed", "cancelled"].includes(status)) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Invalid status. Only 'confirmed' or 'cancelled' are allowed.",
        data: null,
      });
    }

    const result = await AppointmentService.updateAppointmentStatusAfterPayment(
      id,
      status
    );

    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Appointment not found",
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Appointment status updated to ${status}`,
      data: result,
    });
  }
);

const getTransactionByTranId = catchAsync(
  async (req: Request, res: Response) => {
    const { tran_id } = req.params;
    const transaction = await TransactionService.getTransactionByTranId(
      tran_id
    );

    if (!transaction) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Transaction not found",
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Transaction retrieved successfully",
      data: transaction,
    });
  }
);

const getAppointmentByTranId = catchAsync(
  async (req: Request, res: Response) => {
    const { tran_id } = req.params;

    const transaction = await TransactionService.getTransactionByTranId(
      tran_id
    );
    if (!transaction) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Transaction not found",
        data: null,
      });
    }

    // Now fetch the fully populated appointment
    const appointment = await Appointment.findById(transaction.appointment_id)
      .populate("patient_id")
      .populate("registered_doctor_id"); // Populate all necessary fields

    if (!appointment) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Associated appointment not found",
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Appointment retrieved successfully",
      data: appointment,
    });
  }
);

export const TransactionController = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIpn,
  updateAppointmentStatusAfterPayment,
  getTransactionByTranId,
  getAppointmentByTranId,
};
