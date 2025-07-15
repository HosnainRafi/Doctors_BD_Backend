// src/modules/doctor/doctor.routes.ts
import express from "express";
import { doctorController } from "./doctor.controller";
import { doctorValidations } from "./doctor.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.post(
  "/",
  validateRequest(doctorValidations.createDoctorValidation),
  doctorController.createDoctor
);

router.get("/", doctorController.getAllDoctors);
router.get("/deleted", doctorController.getDeletedDoctors);
router.get("/:id", doctorController.getSingleDoctor);
router.patch(
  "/:id",
  validateRequest(doctorValidations.updateDoctorValidation),
  doctorController.updateDoctor
);
router.delete("/:id", doctorController.deleteDoctor);
router.patch("/:id/restore", doctorController.restoreDoctor);
router.post("/import", upload.single("file"), doctorController.importDoctors);
router.post("/ai-search", doctorController.aiDoctorSearch);

export const DoctorRoutes = router;
