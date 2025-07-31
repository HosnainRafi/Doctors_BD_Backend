// src/modules/transaction/transaction.routes.ts

import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { TransactionValidations } from "./transaction.validation";
import { TransactionController } from "./transaction.controller";

const router = Router();

router.post("/initiate/:id", TransactionController.initiatePayment);

router.patch(
  "/appointment/:id/status",
  validateRequest(TransactionValidations.appointmentStatusUpdateValidation),
  TransactionController.updateAppointmentStatusAfterPayment
);

// FIXED: Changed from GET to POST to match SSLCommerz's callback method
router.post("/success", TransactionController.paymentSuccess);
router.post("/fail", TransactionController.paymentFail);
router.post("/cancel", TransactionController.paymentCancel);

// IPN is already correct
router.post("/ipn", TransactionController.paymentIpn);

// These routes are for your frontend to fetch data, so they remain GET
router.get(
  "/transaction/:tran_id",
  TransactionController.getTransactionByTranId
);
router.get(
  "/appointment-by-tran_id/:tran_id",
  TransactionController.getAppointmentByTranId
);

export const TransactionRoutes = router;
