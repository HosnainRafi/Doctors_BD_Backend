"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistrictController = void 0;
const district_service_1 = require("./district.service");
const district_validation_1 = require("./district.validation");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const createDistrict = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Zod-validated body matches IDistrictInput
    const { body } = district_validation_1.DistrictValidations.createDistrictValidation.parse(req);
    // Add defaults if needed
    const payload = Object.assign(Object.assign({}, body), { isActive: (_a = body.isActive) !== null && _a !== void 0 ? _a : true });
    const result = yield district_service_1.DistrictService.createDistrict(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "District created successfully",
        data: result,
    });
}));
const getAllDistrict = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield district_service_1.DistrictService.getAllDistricts(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Districts retrieved successfully",
        data: result,
    });
}));
exports.DistrictController = {
    createDistrict,
    getAllDistrict,
    // Other controller methods...
};
