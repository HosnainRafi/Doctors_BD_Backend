import express from "express";
import { ReviewController } from "./review.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createReviewValidation,
  replyReviewValidation,
} from "./review.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(createReviewValidation),
  ReviewController.createReview
);

router.get("/", ReviewController.getReviews);
router.get("/doctor/:doctor_id", ReviewController.getReviewsByDoctor);

router.patch(
  "/:id/reply",
  validateRequest(replyReviewValidation),
  ReviewController.replyToReview
);

export const ReviewRoutes = router;
