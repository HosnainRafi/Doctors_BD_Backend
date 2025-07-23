import express from "express";
import { PatientController } from "./patient.controller";
import { PatientValidations } from "./patient.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/",
  validateRequest(PatientValidations.createPatientValidation),
  PatientController.createPatient
);

router.get("/", PatientController.getPatients);
router.get("/:id", PatientController.getPatient);

router.patch(
  "/:id",
  validateRequest(PatientValidations.updatePatientValidation),
  PatientController.updatePatient
);

router.delete("/:id", PatientController.deletePatient);

export const PatientRoutes = router;
