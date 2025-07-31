import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { TransactionValidations } from "./transaction.validation";
import { TransactionController } from "./transaction.controller";

const router = Router();

router.post("/initiate/:id", TransactionController.initiatePayment);

// CORRECTED: Apply the new, correct validation schema.
router.patch(
  "/appointment/:id/status",
  validateRequest(TransactionValidations.appointmentStatusUpdateValidation), // Fix: Use the correct validator
  TransactionController.updateAppointmentStatusAfterPayment
);

router.get("/success", TransactionController.paymentSuccess);
router.get("/fail", TransactionController.paymentFail);
router.get("/cancel", TransactionController.paymentCancel);

// Note: It's good practice to validate the IPN route as well.
// You could create a specific validation schema for it.
router.post("/ipn", TransactionController.paymentIpn);

export const TransactionRoutes = router;
