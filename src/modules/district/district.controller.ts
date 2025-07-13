import { Request, Response } from "express";
import { DistrictService } from "./district.service";
import { DistrictValidations } from "./district.validation";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";

const createDistrict = catchAsync(async (req: Request, res: Response) => {
  // Zod-validated body matches IDistrictInput
  const { body } = DistrictValidations.createDistrictValidation.parse(req);

  // Add defaults if needed
  const payload = {
    ...body,
    isActive: body.isActive ?? true, // Default value if not provided
  };

  const result = await DistrictService.createDistrict(payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "District created successfully",
    data: result,
  });
});

export const DistrictController = {
  createDistrict,
  // Other controller methods...
};
