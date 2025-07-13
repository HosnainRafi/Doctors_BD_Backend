import mongoose from "mongoose";
import { Specialization } from "../specialization/specialization.model";
import { DoctorSpecialization } from "./doctorSpecialization.model";
import { Doctor } from "../doctor/doctor.model";

const seedSpecializations = async () => {
  await mongoose.connect("mongodb://localhost:27017/your-db-name");

  // Clear existing data
  await Specialization.deleteMany({});
  await DoctorSpecialization.deleteMany({});

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

  const createdSpecs = await Specialization.insertMany(specializations);

  // Connect doctors to specializations
  const doctors = await Doctor.find();
  const specMap = new Map(
    createdSpecs.map((spec) => [spec.name.toLowerCase(), spec._id])
  );

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
    if (doctor.specialtyList?.length) {
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
      await DoctorSpecialization.insertMany(relations);
    }
  }

  console.log("Specializations seeded successfully");
  process.exit(0);
};

seedSpecializations().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
