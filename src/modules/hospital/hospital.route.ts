// hospital.routes.ts
import express from "express";
import { HospitalController } from "./hospital.controller";
import { HospitalValidations } from "./hospital.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/",
  validateRequest(HospitalValidations.createHospitalValidation),
  HospitalController.createHospital
);

router.get("/", HospitalController.getHospitals);

router
  .route("/:id")
  .get(HospitalController.getHospital)
  .patch(
    validateRequest(HospitalValidations.updateHospitalValidation),
    HospitalController.updateHospital
  )
  .delete(HospitalController.deleteHospital);

export const HospitalRoutes = router;
