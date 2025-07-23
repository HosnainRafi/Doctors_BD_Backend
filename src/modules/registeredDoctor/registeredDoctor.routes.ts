import express from "express";
import { RegisteredDoctorController } from "./registeredDoctor.controller";
import { RegisteredDoctorValidations } from "./registeredDoctor.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/",
  validateRequest(RegisteredDoctorValidations.createRegisteredDoctorValidation),
  RegisteredDoctorController.createDoctor
);

router.get("/", RegisteredDoctorController.getDoctors);
router.get("/:id", RegisteredDoctorController.getDoctor);

router.patch(
  "/:id",
  validateRequest(RegisteredDoctorValidations.updateRegisteredDoctorValidation),
  RegisteredDoctorController.updateDoctor
);

router.delete("/:id", RegisteredDoctorController.deleteDoctor);
router.post(
  "/login",
  validateRequest(RegisteredDoctorValidations.loginRegisteredDoctorValidation),
  RegisteredDoctorController.loginDoctor
);

export const RegisteredDoctorRoutes = router;
