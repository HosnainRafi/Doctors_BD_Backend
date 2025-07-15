"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hospital = void 0;
const mongoose_1 = require("mongoose");
const hospitalSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, index: true },
    address: { type: String, required: true },
    district: { type: mongoose_1.Schema.Types.ObjectId, ref: "District", required: true },
    contactNumbers: {
        type: [String],
        required: true,
        validate: {
            validator: (numbers) => numbers.length > 0,
            message: "At least one contact number is required",
        },
    },
    googleMapUrl: String,
    facilities: [String],
    latitude: Number,
    longitude: Number,
    isDeleted: { type: Boolean, default: false },
    geocodedAddressDetails: {
        house_number: String,
        road: String,
        city: String,
        county: String,
        state: String,
        country: String,
        country_code: String,
    },
}, { timestamps: true, versionKey: false });
hospitalSchema.index({ name: "text", address: "text" });
exports.Hospital = (0, mongoose_1.model)("Hospital", hospitalSchema);
