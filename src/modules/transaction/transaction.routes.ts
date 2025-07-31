// src/modules/transaction/transaction.routes.ts
import { Router } from "express";
import { TransactionController } from "./transaction.controller";

const router = Router();

// Initiate payment
router.post("/initiate/:id", TransactionController.initiatePayment);

// SSLCommerz callbacks (handle both GET and POST)
router.get("/success", TransactionController.paymentSuccess);
router.post("/success", TransactionController.paymentSuccess);

router.get("/fail", TransactionController.paymentFail);
router.post("/fail", TransactionController.paymentFail);

router.get("/cancel", TransactionController.paymentCancel);
router.post("/cancel", TransactionController.paymentCancel);

// IPN (server-to-server callback)
router.post("/ipn", TransactionController.paymentIpn);
router.get(
  "/transaction-with-appointment/:tran_id",
  TransactionController.getTransactionWithAppointment
);
// Other routes
router.get(
  "/transaction/:tran_id",
  TransactionController.getTransactionByTranId
);

export const TransactionRoutes = router;
