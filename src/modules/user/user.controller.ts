import { Request, Response } from "express";
import { UserService } from "./user.service";
import { UserValidations } from "./user.validation";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { signJwt } from "../../app/utils/jwt";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const body = UserValidations.createUserValidation.parse(req.body);
  const result = await UserService.createUser(body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const body = UserValidations.loginUserValidation.parse(req.body);
  const user = await UserService.login(body.email, body.password);

  const token = signJwt({ id: user._id, email: user.email, role: "user" });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    },
  });
});

export const UserController = {
  registerUser,
  loginUser,
};
