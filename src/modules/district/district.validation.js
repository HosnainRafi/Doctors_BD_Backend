"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistrictValidations = void 0;
const zod_1 = require("zod");
const createDistrictValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2),
        slug: zod_1.z.string().regex(/^[a-z0-9-]+$/),
        isActive: zod_1.z.boolean().optional().default(true), // Added with default
        geoBoundaries: zod_1.z.any().optional(), // Basic GeoJSON validation
    }),
});
// Update validation remains the same
const updateDistrictValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        slug: zod_1.z
            .string()
            .regex(/^[a-z0-9-]+$/)
            .optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.DistrictValidations = {
    createDistrictValidation,
    updateDistrictValidation,
};
