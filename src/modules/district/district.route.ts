import express from "express";
import { DistrictController } from "./district.controller";
import { DistrictValidations } from "./district.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/",
  validateRequest(DistrictValidations.createDistrictValidation),
  DistrictController.createDistrict
);

// Other routes...

export const DistrictRoutes = router;
