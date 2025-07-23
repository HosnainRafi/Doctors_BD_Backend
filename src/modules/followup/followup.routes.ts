import express from "express";
import { FollowUpController } from "./followup.controller";
import { FollowUpValidations } from "./followup.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/",
  validateRequest(FollowUpValidations.createFollowUpValidation),
  FollowUpController.createFollowUp
);

router.get("/", FollowUpController.getFollowUps);
router.get("/:id", FollowUpController.getFollowUp);

router.patch(
  "/:id",
  validateRequest(FollowUpValidations.updateFollowUpValidation),
  FollowUpController.updateFollowUp
);
router.get("/doctor/:doctor_id", FollowUpController.getFollowUpsByDoctor);
router.get(
  "/registered-doctor/:registered_doctor_id",
  FollowUpController.getFollowUpsByRegisteredDoctor
);
router.delete("/:id", FollowUpController.deleteFollowUp);

export const FollowUpRoutes = router;
