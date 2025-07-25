import express from "express";
import { UserController } from "./user.controller";
import { UserValidations } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/register",
  validateRequest(UserValidations.createUserValidation),
  UserController.registerUser
);
router.get("/", UserController.getUserByEmail);
router.get("/:id", UserController.getUser);

router.post(
  "/login",
  validateRequest(UserValidations.loginUserValidation),
  UserController.loginUser
);

export const UserRoutes = router;
