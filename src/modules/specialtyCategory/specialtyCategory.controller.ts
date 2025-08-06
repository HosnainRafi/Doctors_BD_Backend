import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { SpecialtyCategoryService } from "./specialtyCategory.service";
import { SpecialtyCategoryValidations } from "./specialtyCategory.validation";

const create = catchAsync(async (req: Request, res: Response) => {
  const body =
    SpecialtyCategoryValidations.createSpecialtyCategoryValidation.parse(
      req.body
    );
  const result = await SpecialtyCategoryService.create(body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Specialty category created successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const parsedQuery =
    SpecialtyCategoryValidations.specialtyCategoryQueryValidation.parse(
      req.query
    );
  const filters: any = {};
  if (parsedQuery.searchTerm) {
    filters.name = { $regex: parsedQuery.searchTerm, $options: "i" };
  }
  const options = {
    page: parsedQuery.page,
    limit: parsedQuery.limit,
    sortBy: parsedQuery.sortBy,
    sortOrder: parsedQuery.sortOrder,
  };
  const result = await SpecialtyCategoryService.getAll(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Specialty categories retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtyCategoryService.getById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Specialty category retrieved successfully",
    data: result,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const { body } =
    SpecialtyCategoryValidations.updateSpecialtyCategoryValidation.parse(req);
  const result = await SpecialtyCategoryService.update(req.params.id, body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Specialty category updated successfully",
    data: result,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtyCategoryService.delete(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Specialty category deleted successfully",
    data: result,
  });
});

export const SpecialtyCategoryController = {
  create,
  getAll,
  getById,
  update,
  remove,
};
