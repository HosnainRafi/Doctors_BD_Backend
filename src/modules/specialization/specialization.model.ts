import { Schema, model } from "mongoose";
import { SpecializationModel } from "./specialization.interface";

const specializationSchema = new Schema<SpecializationModel>(
  {
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Text search index
specializationSchema.index({
  name: "text",
  description: "text",
  relatedDiseases: "text",
});

export const Specialization = model<SpecializationModel>(
  "Specialization",
  specializationSchema
);
