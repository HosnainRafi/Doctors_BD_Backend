import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import {
  IExperience,
  RegisteredDoctorModel,
} from "./registeredDoctor.interface";

const scheduleSchema = new Schema(
  {
    visiting_method: String,
    visiting_day: String,
    from_time: String,
    to_time: String,
  },
  { _id: false }
);

const experienceSchema = new Schema<IExperience>(
  {
    organization_name: String,
    designation: String,
    department: String,
    from: String,
    to: String,
    is_current: Boolean,
    duration_month: Number,
  },
  { _id: false }
);

const consultationSchema = new Schema(
  {
    standard_fee: Number,
    standard_fee_with_vat: Number,
    standard_fee_discount: Number,
    standard_fee_discount_with_vat: Number,
    standard_fee_discount_expire: String,
    follow_up_fee: Number,
    follow_up_fee_with_vat: Number,
    follow_up_fee_discount: Number,
    follow_up_fee_discount_with_vat: Number,
    follow_up_fee_discount_expire: String,
    follow_up_within_day: Number,
    average_waiting_minutes: Number,
    average_consultation_minutes: Number,
  },
  { _id: false }
);

const registeredDoctorSchema = new Schema<RegisteredDoctorModel>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String },
    bmdc_number: { type: String },
    district: { type: String, trim: true }, // <-- Add district
    gender: { type: String, enum: ["Male", "Female", "Other"] }, // <-- Add gender
    specialty: { type: String },
    specialties: [String],
    degree_names: [String],
    additional_qualifications: [String],
    photo: { type: String },
    bio: { type: String },
    isVerified: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    availableSlots: [
      {
        date: { type: String },
        time: { type: String },
      },
    ],
    blockedSlots: [
      {
        date: { type: String },
        time: { type: String },
      },
    ],
    schedules: [scheduleSchema],
    consultation: consultationSchema,
    experiences: {
      type: [experienceSchema],
      default: [], // <-- FIX #1: Ensure 'experiences' is always an array.
    },
    total_experience_years: { type: Number, default: 0 },
    no_of_patients_served: { type: Number, default: 0 },
    review: {
      average_rating: Number,
      total_reviews: Number,
    },
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

registeredDoctorSchema.pre("save", function (next) {
  // Check if experiences field is modified and exists
  if (this.isModified("experiences") && this.experiences) {
    const totalMonths = this.experiences.reduce((acc, exp) => {
      // FIX #2: Refactored logic for better type safety and clarity
      if (exp.from) {
        let endDate: Date;
        if (exp.is_current) {
          endDate = new Date(); // It's a current job
        } else if (exp.to) {
          // This 'else if' guarantees exp.to is a string here
          endDate = new Date(exp.to);
        } else {
          // No end date and not current, so can't calculate duration
          return acc + (exp.duration_month || 0);
        }

        const startDate = new Date(exp.from);
        // Add a check for valid dates to prevent NaN
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          const duration =
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth());
          return acc + Math.max(0, duration); // Ensure duration isn't negative
        }
      }
      return acc + (exp.duration_month || 0);
    }, 0);
    this.total_experience_years = Math.floor(totalMonths / 12);
  }
  next();
});

registeredDoctorSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

registeredDoctorSchema.methods.comparePassword = async function (
  password: string
) {
  return bcrypt.compare(password, this.password);
};

export const RegisteredDoctor = model<RegisteredDoctorModel>(
  "RegisteredDoctor",
  registeredDoctorSchema
);
