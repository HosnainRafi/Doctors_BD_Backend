import express from "express";
import { SpecializationController } from "./specialization.controller";
import { SpecializationValidations } from "./specialization.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/",
  validateRequest(SpecializationValidations.createSpecializationValidation),
  SpecializationController.createSpecialization
);

// router.get("/", SpecializationController.getSpecializations);
// router.get("/search", SpecializationController.searchSpecializations);

export const SpecializationRoutes = router;
