import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { SpecializationService } from "./specialization.service";
import { SpecializationValidations } from "./specialization.validation";

const createSpecialization = catchAsync(async (req: Request, res: Response) => {
  const { body } =
    SpecializationValidations.createSpecializationValidation.parse(req);
  const result = await SpecializationService.createSpecialization(body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Specialization created successfully",
    data: result,
  });
});

// Add other controller methods...

export const SpecializationController = {
  createSpecialization,
  // getSpecializations, searchSpecializations, etc.
};
