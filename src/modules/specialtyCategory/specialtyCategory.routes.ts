import express from "express";
import { SpecialtyCategoryController } from "./specialtyCategory.controller";
import { SpecialtyCategoryValidations } from "./specialtyCategory.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/",
  validateRequest(
    SpecialtyCategoryValidations.createSpecialtyCategoryValidation
  ),
  SpecialtyCategoryController.create
);

router.get("/", SpecialtyCategoryController.getAll);

router.get("/:id", SpecialtyCategoryController.getById);

router.patch(
  "/:id",
  validateRequest(
    SpecialtyCategoryValidations.updateSpecialtyCategoryValidation
  ),
  SpecialtyCategoryController.update
);

router.delete("/:id", SpecialtyCategoryController.remove);

export const SpecialtyCategoryRoutes = router;
