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
exports.HospitalController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const hospital_service_1 = require("./hospital.service");
const hospital_validation_1 = require("./hospital.validation");
const pick_1 = require("../../shared/pick");
const hospital_constants_1 = require("./hospital.constants");
// Create hospital
const createHospital = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = hospital_validation_1.HospitalValidations.createHospitalValidation.parse(req);
    const result = yield hospital_service_1.HospitalService.createHospital(body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Hospital created successfully",
        data: result,
    });
}));
// Get paginated list of hospitals
const getHospitals = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedQuery = hospital_validation_1.HospitalValidations.hospitalQueryValidation.parse(req.query);
    // Safely convert readonly array to mutable one
    const filters = (0, pick_1.pick)(parsedQuery, Array.from(hospital_constants_1.hospitalFilterableFields));
    const options = (0, pick_1.pick)(parsedQuery, hospital_constants_1.hospitalPaginationFields);
    const result = yield hospital_service_1.HospitalService.getHospitals(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Hospitals retrieved successfully",
        data: result,
    });
}));
// Get a single hospital by ID
const getHospital = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield hospital_service_1.HospitalService.getHospital(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Hospital retrieved successfully",
        data: result,
    });
}));
// Update hospital by ID
const updateHospital = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = hospital_validation_1.HospitalValidations.updateHospitalValidation.parse(req);
    const result = yield hospital_service_1.HospitalService.updateHospital(req.params.id, body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Hospital updated successfully",
        data: result,
    });
}));
// Soft delete hospital by ID
const deleteHospital = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield hospital_service_1.HospitalService.deleteHospital(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Hospital deleted successfully",
        data: result,
    });
}));
exports.HospitalController = {
    createHospital,
    getHospitals,
    getHospital,
    updateHospital,
    deleteHospital,
};
