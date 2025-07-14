// src/modules/doctor/doctor.service.ts
import { Doctor } from "./doctor.model";
import {
  IDoctorDocument,
  IPaginationResponse,
  PaginationOptions,
  TDoctor,
} from "./doctor.interface";
import { Query } from "express-serve-static-core";
import mongoose, { SortOrder } from "mongoose";
import { DoctorSpecialization } from "../doctor-specialization/doctorSpecialization.model";
// adjust path if needed

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

    // Basic filters
    if (query.district) filter.district = query.district;

    // Specialty filter
    if (query.specialty) {
      const specializations = await DoctorSpecialization.find({
        specialization: new mongoose.Types.ObjectId(query.specialty as string),
      });
      filter._id = { $in: specializations.map((s) => s.doctor) };
    }

    // Enhanced search across all relevant fields
    if (query.searchTerm) {
      filter.$or = [
        { name: { $regex: query.searchTerm, $options: "i" } },
        { specialty: { $regex: query.searchTerm, $options: "i" } },
        { degree: { $regex: query.searchTerm, $options: "i" } },
        { designation: { $regex: query.searchTerm, $options: "i" } },
        { specialtyList: { $regex: query.searchTerm, $options: "i" } },
        { specialtyCategories: { $regex: query.searchTerm, $options: "i" } },
        {
          "chambers.hospital_name": { $regex: query.searchTerm, $options: "i" },
        },
        { "chambers.address": { $regex: query.searchTerm, $options: "i" } },
        {
          "chambers.visiting_hours.visiting_days": {
            $regex: query.searchTerm,
            $options: "i",
          },
        },
        {
          "chambers.visiting_hours.visiting_hours": {
            $regex: query.searchTerm,
            $options: "i",
          },
        },
        {
          "chambers.visiting_hours.time_slots.original_time": {
            $regex: query.searchTerm,
            $options: "i",
          },
        },
      ];
    }

    // Direct filters for specific chamber fields
    if (query.hospital_name) {
      filter["chambers.hospital_name"] = {
        $regex: query.hospital_name,
        $options: "i",
      };
    }

    if (query.address) {
      filter["chambers.address"] = { $regex: query.address, $options: "i" };
    }

    // Visiting days filter (exact match)
    if (query.visiting_day) {
      filter["chambers.visiting_hours.visiting_days"] = query.visiting_day;
    }

    // Visiting hours filter (partial match)
    if (query.visiting_hours) {
      filter["chambers.visiting_hours.visiting_hours"] = {
        $regex: query.visiting_hours,
        $options: "i",
      };
    }

    // Time slot filter
    if (query.time_slot) {
      filter["chambers.visiting_hours.time_slots"] = {
        $elemMatch: {
          $or: [
            { start_time_24hr: { $regex: query.time_slot, $options: "i" } },
            { end_time_24hr: { $regex: query.time_slot, $options: "i" } },
            { original_time: { $regex: query.time_slot, $options: "i" } },
          ],
        },
      };
    }

    // Pagination parameters
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = (query.sortBy as string) || "createdAt";
    const sortOrder: mongoose.SortOrder = query.sortOrder === "asc" ? 1 : -1;
    const sort: { [key: string]: mongoose.SortOrder } = { [sortBy]: sortOrder };

    // Execute query with pagination
    const [doctors, total] = await Promise.all([
      Doctor.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Doctor.countDocuments(filter),
    ]);

    return {
      data: doctors,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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
