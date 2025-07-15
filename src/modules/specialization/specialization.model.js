"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Specialization = void 0;
const mongoose_1 = require("mongoose");
const specializationSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    description: {
        type: String,
        trim: true,
    },
    icon: {
        type: String, // Store URL or icon class name
        default: "stethoscope", // Default icon
    },
    category: {
        type: String,
        enum: [
            "General",
            "Surgery",
            "Cardiology",
            "Oncology",
            "Pediatrics",
            "Other",
        ],
        default: "General",
    },
    relatedDiseases: {
        type: [String], // e.g. ["Cancer", "Tumor"] for Oncologists
        default: [],
    },
}, {
    timestamps: true,
    versionKey: false,
});
// Text search index
specializationSchema.index({
    name: "text",
    description: "text",
    relatedDiseases: "text",
});
exports.Specialization = (0, mongoose_1.model)("Specialization", specializationSchema);
