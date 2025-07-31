import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { SSLCommerzConfig } from "../../config/sslcommerz";
import { AppointmentService } from "../appointment/appointment.service";

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
  const { tran_id } = req.query;
  try {
    await TransactionService.updateTransactionStatus(
      tran_id as string,
      "completed"
    );
    // Always add status param for frontend
    res.redirect(
      `${SSLCommerzConfig.frontend_success_url}?tran_id=${tran_id}&status=success`
    );
  } catch (error) {
    console.error("Payment success error:", error);
    res.redirect(
      `${SSLCommerzConfig.frontend_fail_url}?tran_id=${tran_id}&status=failed`
    );
  }
});

const paymentFail = catchAsync(async (req: Request, res: Response) => {
  const { tran_id } = req.query;

  try {
    await TransactionService.updateTransactionStatus(
      tran_id as string,
      "failed"
    );
    res.redirect(SSLCommerzConfig.frontend_fail_url);
  } catch (error) {
    console.error("Payment fail error:", error);
    res.redirect(SSLCommerzConfig.frontend_fail_url);
  }
});

const paymentCancel = catchAsync(async (req: Request, res: Response) => {
  const { tran_id } = req.query;

  try {
    await TransactionService.updateTransactionStatus(
      tran_id as string,
      "cancelled"
    );
    res.redirect(SSLCommerzConfig.frontend_cancel_url);
  } catch (error) {
    console.error("Payment cancel error:", error);
    res.redirect(SSLCommerzConfig.frontend_cancel_url);
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

export const TransactionController = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIpn,
  updateAppointmentStatusAfterPayment,
  getTransactionByTranId,
};
