"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecializationValidations = exports.updateSpecializationValidation = exports.createSpecializationValidation = void 0;
const zod_1 = require("zod");
const categoryEnum = [
    "General",
    "Surgery",
    "Cardiology",
    "Oncology",
    "Pediatrics",
    "Other",
];
exports.createSpecializationValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(3).max(100),
        description: zod_1.z.string().optional(),
        icon: zod_1.z.string().optional(),
        category: zod_1.z.enum(categoryEnum).optional(),
        relatedDiseases: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.updateSpecializationValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(3).max(100).optional(),
        description: zod_1.z.string().optional(),
        icon: zod_1.z.string().optional(),
        category: zod_1.z.enum(categoryEnum).optional(),
        relatedDiseases: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.SpecializationValidations = {
    createSpecializationValidation: exports.createSpecializationValidation,
    updateSpecializationValidation: exports.updateSpecializationValidation,
};
