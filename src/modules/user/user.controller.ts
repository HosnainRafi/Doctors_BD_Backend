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

const getUserByEmail = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.query;
  if (!email) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Email is required",
      data: null,
    });
  }
  const user = await UserService.getUserByEmail(email as string);
  if (!user) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not found",
      data: null,
    });
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data: user,
  });
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.getUserById(req.params.id);
  if (!user) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not found",
      data: null,
    });
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data: user,
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
  getUser,
  getUserByEmail,
};
