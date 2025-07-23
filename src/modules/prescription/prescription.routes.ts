import express from "express";
import { PrescriptionController } from "./prescription.controller";
import { PrescriptionValidations } from "./prescription.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/",
  validateRequest(PrescriptionValidations.createPrescriptionValidation),
  PrescriptionController.createPrescription
);

router.get("/", PrescriptionController.getPrescriptions);
router.get("/:id", PrescriptionController.getPrescription);
router.get("/:id/pdf", PrescriptionController.downloadPrescriptionPdf);

router.patch(
  "/:id",
  validateRequest(PrescriptionValidations.updatePrescriptionValidation),
  PrescriptionController.updatePrescription
);
router.delete("/:id", PrescriptionController.deletePrescription);
router.get(
  "/doctor/:doctor_id",
  PrescriptionController.getPrescriptionsByDoctor
);
router.get(
  "/registered-doctor/:registered_doctor_id",
  PrescriptionController.getPrescriptionsByRegisteredDoctor
);

export const PrescriptionRoutes = router;
