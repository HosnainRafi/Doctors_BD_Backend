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
    // ... other fields remain the same
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret._id = ret.id;
        delete ret.id;
        return ret;
      },
    },
  }
);

// Indexes
doctorSchema.index({ id: 1, isDeleted: 1 });
doctorSchema.index({ name: "text", specialty: "text" });
doctorSchema.index({ district: 1, isDeleted: 1 });

export const Doctor = model<IDoctorDocument>("Doctor", doctorSchema);
