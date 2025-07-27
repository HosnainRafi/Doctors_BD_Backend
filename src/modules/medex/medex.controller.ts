import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { MedexService } from "./medex.service";
import { medexSearchValidation } from "./medex.validation";

const searchMedex = catchAsync(async (req: Request, res: Response) => {
  const { query } = medexSearchValidation.parse(req.query);
  const results = await MedexService.searchMedicine(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medex search results fetched successfully",
    data: results,
  });
});

const getMedicineDetails = catchAsync(async (req: Request, res: Response) => {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({
      success: false,
      message: "URL is required",
    });
  }

  const result = await MedexService.getMedicineDetails(url);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medex medicine detail fetched successfully",
    data: result,
  });
});

export const MedexController = {
  searchMedex,
  getMedicineDetails,
};
