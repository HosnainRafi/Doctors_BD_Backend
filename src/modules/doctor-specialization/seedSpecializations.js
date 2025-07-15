"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const specialization_model_1 = require("../specialization/specialization.model");
const doctorSpecialization_model_1 = require("./doctorSpecialization.model");
const doctor_model_1 = require("../doctor/doctor.model");
const seedSpecializations = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield mongoose_1.default.connect("mongodb://localhost:27017/your-db-name");
    // Clear existing data
    yield specialization_model_1.Specialization.deleteMany({});
    yield doctorSpecialization_model_1.DoctorSpecialization.deleteMany({});
    // Seed specializations from doctor data
    const specializations = [
        {
            name: "Cancer & Tumor Specialist",
            category: "Oncology",
            relatedDiseases: ["Cancer", "Tumor"],
            icon: "dna",
        },
        {
            name: "Cardiology",
            category: "Cardiology",
            relatedDiseases: ["Heart Disease", "Hypertension"],
            icon: "heartbeat",
        },
        // Add more based on your doctor data
    ];
    const createdSpecs = yield specialization_model_1.Specialization.insertMany(specializations);
    // Connect doctors to specializations
    const doctors = yield doctor_model_1.Doctor.find();
    const specMap = new Map(createdSpecs.map((spec) => [spec.name.toLowerCase(), spec._id]));
    for (const doctor of doctors) {
        const relations = [];
        // Primary specialty
        if (doctor.specialty) {
            const specId = specMap.get(doctor.specialty.toLowerCase());
            if (specId) {
                relations.push({
                    doctor: doctor._id,
                    specialization: specId,
                    isPrimary: true,
                });
            }
        }
        // Secondary specialties
        if ((_a = doctor.specialtyList) === null || _a === void 0 ? void 0 : _a.length) {
            for (const specName of doctor.specialtyList) {
                const specId = specMap.get(specName.toLowerCase());
                if (specId) {
                    relations.push({
                        doctor: doctor._id,
                        specialization: specId,
                        isPrimary: false,
                    });
                }
            }
        }
        if (relations.length > 0) {
            yield doctorSpecialization_model_1.DoctorSpecialization.insertMany(relations);
        }
    }
    console.log("Specializations seeded successfully");
    process.exit(0);
});
seedSpecializations().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
