import { Schema, model } from "mongoose";
import { DistrictModel } from "./district.interface";

const districtSchema = new Schema<DistrictModel>(
  {
    id: { type: Number, required: true, unique: true },
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
        type: Schema.Types.Mixed,
        required: false,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Text index for search
districtSchema.index({ name: "text" });
// Geospatial index if using geo queries
districtSchema.index({ geoBoundaries: "2dsphere" });

export const District = model<DistrictModel>("District", districtSchema);
