"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorSpecialization = void 0;
const mongoose_1 = require("mongoose");
const doctorSpecializationSchema = new mongoose_1.Schema({
    doctor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    specialization: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Specialization",
        required: true,
    },
    isPrimary: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true, versionKey: false });
// Compound index for unique relationships
doctorSpecializationSchema.index({ doctor: 1, specialization: 1 }, { unique: true });
exports.DoctorSpecialization = (0, mongoose_1.model)("DoctorSpecialization", doctorSpecializationSchema);
