import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { RegisteredDoctorModel } from "./registeredDoctor.interface";

const registeredDoctorSchema = new Schema<RegisteredDoctorModel>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    bmdc_number: { type: String },
    specialty: { type: String },
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
  },
  { timestamps: true, versionKey: false }
);

// Hash password before save
registeredDoctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Add method
registeredDoctorSchema.methods.comparePassword = async function (
  password: string
) {
  return bcrypt.compare(password, this.password);
};

export const RegisteredDoctor = model<RegisteredDoctorModel>(
  "RegisteredDoctor",
  registeredDoctorSchema
);
