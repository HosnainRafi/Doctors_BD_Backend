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
exports.doctorController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const doctor_service_1 = require("./doctor.service");
const doctorSpecialization_model_1 = require("../doctor-specialization/doctorSpecialization.model");
const doctor_validation_1 = require("./doctor.validation");
const createDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorData = doctor_validation_1.doctorValidations.createDoctorValidation.parse(req.body);
    const result = yield doctor_service_1.DoctorServices.createDoctor(doctorData.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Doctor created successfully",
        data: result,
    });
}));
const getAllDoctors = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield doctor_service_1.DoctorServices.getAllDoctors(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Doctors retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield doctor_service_1.DoctorServices.getSingleDoctor(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Doctor retrieved successfully",
        data: result,
    });
}));
const updateDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { body } = doctor_validation_1.doctorValidations.updateDoctorValidation.parse(req);
    const result = yield doctor_service_1.DoctorServices.updateDoctor(id, body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Doctor updated successfully",
        data: result,
    });
}));
const deleteDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield doctor_service_1.DoctorServices.deleteDoctor(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Doctor deleted successfully",
        data: result,
    });
}));
const getDoctorsBySpecialization = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { specializationId } = req.params;
    const doctors = yield doctorSpecialization_model_1.DoctorSpecialization.find({
        specialization: specializationId,
    })
        .populate("doctor")
        .populate("specialization");
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Doctors retrieved by specialization",
        data: doctors,
    });
}));
const restoreDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield doctor_service_1.DoctorServices.restoreDoctor(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Doctor restored successfully",
        data: result,
    });
}));
const getDeletedDoctors = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield doctor_service_1.DoctorServices.getDeletedDoctors();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Deleted doctors retrieved successfully",
        data: result,
    });
}));
const importDoctors = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new Error("No file uploaded");
    }
    const doctorsData = JSON.parse(req.file.buffer.toString());
    const validationResults = yield Promise.allSettled(doctorsData.map((doctor) => doctor_validation_1.doctorValidations.createDoctorValidation.parseAsync({ body: doctor })));
    const validDoctors = [];
    const errors = [];
    validationResults.forEach((result, index) => {
        var _a, _b;
        if (result.status === "fulfilled") {
            validDoctors.push(result.value.body);
        }
        else {
            errors.push({
                doctor: doctorsData[index],
                error: ((_b = (_a = result.reason.errors) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) || "Validation failed",
            });
        }
    });
    const createdDoctors = yield Promise.all(validDoctors.map((doctor) => doctor_service_1.DoctorServices.createDoctor(doctor)));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `Import completed: ${createdDoctors.length} succeeded, ${errors.length} failed`,
        data: {
            successes: createdDoctors,
            errors,
        },
    });
    // NEW FUNCTION (properly placed at the root level)
}));
const aiDoctorSearch = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt } = req.body;
    if (!prompt) {
        throw new Error("Search prompt is required");
    }
    try {
        console.log("Processing AI search for prompt:", prompt);
        const result = yield doctor_service_1.DoctorServices.aiSearchDoctors(prompt);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "AI search results retrieved successfully",
            data: result.data,
            meta: result.meta,
        });
    }
    catch (error) {
        let errorMessage = "AI search failed";
        let errorDetails = undefined;
        if (error instanceof Error) {
            errorMessage = error.message.includes("Failed to analyze")
                ? "The AI service is currently unavailable. Please try a simpler search."
                : error.message;
            if (process.env.NODE_ENV === "development") {
                errorDetails = {
                    message: error.message,
                    stack: error.stack,
                    name: error.name,
                };
            }
        }
        // Type-safe error response
        const errorResponse = {
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            success: false,
            message: errorMessage,
        };
        if (errorDetails) {
            errorResponse.error = errorDetails;
        }
        res.status(errorResponse.statusCode).json(errorResponse);
    }
}));
exports.doctorController = {
    createDoctor,
    getAllDoctors,
    getSingleDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorsBySpecialization,
    restoreDoctor,
    importDoctors,
    getDeletedDoctors,
    aiDoctorSearch,
};
