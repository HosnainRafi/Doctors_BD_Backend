// src/modules/doctor/doctor.service.ts
import { Doctor } from "./doctor.model";
import { IDoctorDocument, TDoctor } from "./doctor.interface";
import { Query } from "express-serve-static-core";
import mongoose from "mongoose";
import { DoctorSpecialization } from "../doctor-specialization/doctorSpecialization.model";
import { Types } from "mongoose";

export const DoctorServices = {
  // Create Doctor
  createDoctor: async (payload: TDoctor) => {
    return await Doctor.create(payload);
  },

  updateDoctor: async (id: string, payload: Partial<TDoctor>) => {
    return await Doctor.findOneAndUpdate({ id }, payload, {
      new: true,
      runValidators: true,
    });
  },

  getAllDoctors: async (query: Query) => {
    const filter: mongoose.FilterQuery<IDoctorDocument> = { isDeleted: false };

    if (query.district) filter.district = query.district;

    if (query.specialty) {
      const specializations = await DoctorSpecialization.find({
        specialization: new mongoose.Types.ObjectId(query.specialty as string),
      });
      filter._id = { $in: specializations.map((s) => s.doctor) };
    }

    if (query.searchTerm) {
      filter.$or = [
        { name: { $regex: query.searchTerm, $options: "i" } },
        {
          "chambers.hospital_name": { $regex: query.searchTerm, $options: "i" },
        },
      ];
    }

    if (query.day) {
      filter["chambers.visiting_hours.visiting_days"] = {
        $in: [query.day as string],
      };
    }

    return await Doctor.find(filter).lean();
  },

  getSingleDoctor: async (id: string) => {
    const [doctor] = await Doctor.aggregate([
      { $match: { id, isDeleted: false } },
      {
        $lookup: {
          from: "doctorspecializations",
          localField: "_id",
          foreignField: "doctor",
          as: "specializations",
        },
      },
      {
        $lookup: {
          from: "specializations",
          localField: "specializations.specialization",
          foreignField: "_id",
          as: "specializationDetails",
        },
      },
      {
        $addFields: {
          primarySpecialization: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$specializationDetails",
                  as: "spec",
                  cond: {
                    $anyElementTrue: {
                      $map: {
                        input: "$specializations",
                        as: "rel",
                        in: {
                          $and: [
                            { $eq: ["$$rel.specialization", "$$spec._id"] },
                            { $eq: ["$$rel.isPrimary", true] },
                          ],
                        },
                      },
                    },
                  },
                },
              },
              0,
            ],
          },
          secondarySpecializations: {
            $filter: {
              input: "$specializationDetails",
              as: "spec",
              cond: {
                $anyElementTrue: {
                  $map: {
                    input: "$specializations",
                    as: "rel",
                    in: {
                      $and: [
                        { $eq: ["$$rel.specialization", "$$spec._id"] },
                        { $eq: ["$$rel.isPrimary", false] },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    return doctor;
  },

  deleteDoctor: async (id: string) => {
    return await Doctor.findOneAndUpdate(
      { id, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
  },

  restoreDoctor: async (id: string) => {
    return await Doctor.findOneAndUpdate(
      { id, isDeleted: true },
      { $set: { isDeleted: false, deletedAt: null } },
      { new: true }
    );
  },

  getDeletedDoctors: async () => {
    return await Doctor.find({ isDeleted: true }).lean();
  },
};
