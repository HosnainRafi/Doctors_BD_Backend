"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.District = void 0;
const mongoose_1 = require("mongoose");
const districtSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    geoBoundaries: {
        type: {
            type: String,
            enum: [
                "Point",
                "LineString",
                "Polygon",
                "MultiPoint",
                "MultiLineString",
                "MultiPolygon",
            ],
            required: false,
        },
        coordinates: {
            type: mongoose_1.Schema.Types.Mixed,
            required: false,
        },
    },
}, {
    timestamps: true,
    versionKey: false,
});
// Text index for search
districtSchema.index({ name: "text" });
// Geospatial index if using geo queries
districtSchema.index({ geoBoundaries: "2dsphere" });
exports.District = (0, mongoose_1.model)("District", districtSchema);
