import { Schema, model } from "mongoose";
import { HospitalModel } from "./hospital.interface";

const hospitalSchema = new Schema<HospitalModel>(
  {
    name: { type: String, required: true, trim: true, index: true },
    address: { type: String, required: true },
    district: { type: Schema.Types.ObjectId, ref: "District", required: true },
    contactNumbers: {
      type: [String],
      required: true,
      validate: {
        validator: (numbers: string[]) => numbers.length > 0,
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
  },
  { timestamps: true, versionKey: false }
);

hospitalSchema.index({ name: "text", address: "text" });

export const Hospital = model<HospitalModel>("Hospital", hospitalSchema);
