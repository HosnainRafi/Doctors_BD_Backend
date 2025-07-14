// src/modules/doctor/doctor.model.ts
import { Schema, model } from "mongoose";
import {
  IDoctorDocument,
  TChamber,
  TVisitingHours,
  TTimeSlot,
} from "./doctor.interface";

const timeSlotSchema = new Schema<TTimeSlot>({
  start_time_24hr: { type: String, required: true },
  end_time_24hr: { type: String, required: true },
  original_time: { type: String, required: true },
});

const visitingHoursSchema = new Schema<TVisitingHours>({
  visiting_days: { type: [String], required: true },
  visiting_hours: { type: [String], required: true },
  closed_days: { type: [String], required: true },
  original_text: { type: String, required: true },
  time_slots: { type: [timeSlotSchema], required: true },
});

const chamberSchema = new Schema<TChamber>({
  hospital_name: { type: String, required: true },
  address: { type: String, required: true },
  appointment_contact: { type: String, required: true },
  visiting_hours: { type: visitingHoursSchema, required: true },
  url: { type: String, required: true },
});

const doctorSchema = new Schema<IDoctorDocument>(
  {
    id: { type: String, required: true, unique: true },
    district: { type: String, required: true },
    name: { type: String, required: true },
    photo: { type: String, required: true },
    degree: { type: String, required: true },
    specialty: { type: String, required: true },
    workplace: { type: String, required: true },
    hospital_name: { type: String, required: true },
    hospital_link: { type: String, required: true },
    rating: { type: String, required: true },
    chambers: [{ type: chamberSchema, required: true }],
    profile_url: { type: String, required: true },
    designation: { type: String, required: true },
    source_hospital: { type: String, required: true },
    specialtyList: { type: [String], required: true },
    specialtyCategories: { type: [String], required: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret._id = doc._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

doctorSchema.index(
  {
    name: "text",
    specialty: "text",
    "chambers.hospital_name": "text",
    "chambers.address": "text",
    specialtyList: "text",
    specialtyCategories: "text",
  },
  {
    weights: {
      name: 5,
      "chambers.hospital_name": 4,
      specialty: 3,
      specialtyList: 2,
      specialtyCategories: 1,
    },
    name: "doctor_text_search",
  }
);

// Individual indexes for frequently queried fields
doctorSchema.index({ district: 1 });
doctorSchema.index({ "chambers.visiting_hours.visiting_days": 1 });
doctorSchema.index({ "chambers.visiting_hours.time_slots.original_time": 1 });
doctorSchema.index({ "chambers.visiting_hours.visiting_hours": 1 });
doctorSchema.index({ specialtyList: 1 });
doctorSchema.index({ specialtyCategories: 1 });

export const Doctor = model<IDoctorDocument>("Doctor", doctorSchema);
