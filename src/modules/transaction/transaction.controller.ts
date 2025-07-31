// src/modules/transaction/transaction.controller.ts
import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import catchAsync from "../../shared/catchAsync";
import { SSLCommerzConfig } from "../../config/sslcommerz";
import axios from "axios";

const validateTransaction = async (val_id: string) => {
  try {
    const store_id = SSLCommerzConfig.store_id;
    const store_passwd = SSLCommerzConfig.store_password;
    const validateUrl = `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_passwd}&v=1&format=json`;

    const response = await axios.get(validateUrl);
    return response.data;
  } catch (error) {
    console.error("Error validating transaction:", error);
    throw new Error("Failed to validate transaction with SSLCommerz");
  }
};

const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
  // Log the incoming request for debugging
  console.log("Payment success request method:", req.method);
  console.log("Payment success request query:", req.query);
  console.log("Payment success request body:", req.body);

  // Get transaction ID and validation ID from query (GET) or body (POST)
  const tran_id = req.query.tran_id || req.body.tran_id;
  const val_id = req.query.val_id || req.body.val_id;

  // Validate required fields
  if (!tran_id || !val_id) {
    console.error("Transaction ID or Validation ID is missing");
    return res.status(400).json({
      success: false,
      message: "Transaction ID and Validation ID are required",
    });
  }

  try {
    // Validate the transaction with SSLCommerz
    console.log("Validating transaction with SSLCommerz...");
    const validationData = await validateTransaction(val_id as string);
    console.log("SSLCommerz validation response:", validationData);

    // Check if validation was successful
    if (validationData.status !== "VALID") {
      console.error("Transaction validation failed:", validationData);
      return res.redirect(
        `${SSLCommerzConfig.frontend_fail_url}?tran_id=${tran_id}&status=validation&reason=${validationData.error}`
      );
    }

    // Update transaction status to completed
    await TransactionService.updateTransactionStatus(
      tran_id as string,
      "completed"
    );

    // Redirect to frontend with transaction details
    return res.redirect(
      `${SSLCommerzConfig.frontend_success_url}?tran_id=${tran_id}&status=success`
    );
  } catch (error) {
    console.error("Payment success error:", error);
    return res.redirect(
      `${SSLCommerzConfig.frontend_fail_url}?tran_id=${tran_id}&status=error`
    );
  }
});

const paymentFail = catchAsync(async (req: Request, res: Response) => {
  // Log the incoming request for debugging
  console.log("Payment fail request method:", req.method);
  console.log("Payment fail request query:", req.query);
  console.log("Payment fail request body:", req.body);

  // Get transaction ID from query (GET) or body (POST)
  const tran_id = req.query.tran_id || req.body.tran_id;

  // Validate transaction ID
  if (!tran_id) {
    console.error("Transaction ID is missing in the request");
    return res.status(400).json({
      success: false,
      message: "Transaction ID is required",
    });
  }

  try {
    // Update transaction status to failed
    await TransactionService.updateTransactionStatus(
      tran_id as string,
      "failed"
    );

    // Redirect to frontend with transaction details
    return res.redirect(
      `${SSLCommerzConfig.frontend_fail_url}?tran_id=${tran_id}&status=failed`
    );
  } catch (error) {
    console.error("Payment fail error:", error);
    return res.redirect(
      `${SSLCommerzConfig.frontend_fail_url}?tran_id=${tran_id}&status=error`
    );
  }
});

const paymentCancel = catchAsync(async (req: Request, res: Response) => {
  // Log the incoming request for debugging
  console.log("Payment cancel request method:", req.method);
  console.log("Payment cancel request query:", req.query);
  console.log("Payment cancel request body:", req.body);

  // Get transaction ID from query (GET) or body (POST)
  const tran_id = req.query.tran_id || req.body.tran_id;

  // Validate transaction ID
  if (!tran_id) {
    console.error("Transaction ID is missing in the request");
    return res.status(400).json({
      success: false,
      message: "Transaction ID is required",
    });
  }

  try {
    // Update transaction status to cancelled
    await TransactionService.updateTransactionStatus(
      tran_id as string,
      "cancelled"
    );

    // Redirect to frontend with transaction details
    return res.redirect(
      `${SSLCommerzConfig.frontend_cancel_url}?tran_id=${tran_id}&status=cancelled`
    );
  } catch (error) {
    console.error("Payment cancel error:", error);
    return res.redirect(
      `${SSLCommerzConfig.frontend_cancel_url}?tran_id=${tran_id}&status=error`
    );
  }
});

const paymentIpn = catchAsync(async (req: Request, res: Response) => {
  // Log the incoming request for debugging
  console.log("IPN request body:", req.body);

  const { tran_id, val_id, status } = req.body;

  try {
    // Validate the transaction with SSLCommerz
    if (val_id) {
      const validationData = await validateTransaction(val_id);

      if (validationData.status === "VALID") {
        await TransactionService.updateTransactionStatus(tran_id, "completed");
      } else {
        await TransactionService.updateTransactionStatus(tran_id, "failed");
      }
    } else {
      // If no val_id, use the status field
      if (status === "VALID") {
        await TransactionService.updateTransactionStatus(tran_id, "completed");
      } else {
        await TransactionService.updateTransactionStatus(tran_id, "failed");
      }
    }

    res.status(200).send({ success: true });
  } catch (error: any) {
    console.error("IPN error:", error);
    res.status(500).send({ success: false, error: error.message });
  }
});

const getTransactionByTranId = catchAsync(
  async (req: Request, res: Response) => {
    const { tran_id } = req.params;
    const transaction = await TransactionService.getTransactionByTranId(
      tran_id
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction retrieved successfully",
      data: transaction,
    });
  }
);

// src/modules/transaction/transaction.controller.ts
const getTransactionWithAppointment = catchAsync(
  async (req: Request, res: Response) => {
    const { tran_id } = req.params;
    const transaction = await TransactionService.getTransactionByTranId(
      tran_id
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction retrieved successfully",
      data: transaction,
    });
  }
);

// Add to TransactionController exports

export const TransactionController = {
  initiatePayment: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TransactionService.initiatePayment(id);

    res.status(200).json({
      success: true,
      message: "Payment initiated successfully",
      data: result,
    });
  }),

  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIpn,
  getTransactionByTranId,
  getTransactionWithAppointment,
};
