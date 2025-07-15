"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalValidations = exports.hospitalQueryValidation = exports.updateHospitalValidation = exports.createHospitalValidation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const phoneRegex = /^(?:\+88|01)[0-9]{9,10}$/;
exports.createHospitalValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(3),
        address: zod_1.z.string().min(10),
        district: zod_1.z.string().transform((val) => new mongoose_1.default.Types.ObjectId(val)),
        contactNumbers: zod_1.z.array(zod_1.z.string().regex(phoneRegex)).min(1),
        googleMapUrl: zod_1.z.string().url().optional(),
        facilities: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.updateHospitalValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(3).optional(),
        address: zod_1.z.string().min(10).optional(),
        district: zod_1.z
            .string()
            .transform((val) => (val ? new mongoose_1.default.Types.ObjectId(val) : undefined))
            .optional(),
        contactNumbers: zod_1.z.array(zod_1.z.string().regex(phoneRegex)).min(1).optional(),
        googleMapUrl: zod_1.z.string().url().optional(),
        facilities: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.hospitalQueryValidation = zod_1.z.object({
    searchTerm: zod_1.z.string().optional(),
    limit: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : undefined)),
    page: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : undefined)),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
});
exports.HospitalValidations = {
    createHospitalValidation: exports.createHospitalValidation,
    updateHospitalValidation: exports.updateHospitalValidation,
    hospitalQueryValidation: exports.hospitalQueryValidation,
};
