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
import axios from "axios";
import config from "../../app/config";
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
    console.log(query);
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

  async aiSearchDoctors(prompt: string): Promise<{
    data: IDoctorDocument[];
    meta: any;
    searchCriteria: any;
  }> {
    const aiResponse = await this.analyzePromptWithOpenRouter(prompt);
    const searchCriteria = this.extractSearchCriteria(aiResponse);
    const mongoQuery = this.buildMongoQuery(searchCriteria);
    const doctors = await Doctor.find(mongoQuery).lean();

    return {
      data: doctors,
      meta: {},
      searchCriteria,
    };
  },

  async analyzePromptWithOpenRouter(prompt: string): Promise<any> {
    const OPENROUTER_API_KEY = config.openUI_url;
    const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

    try {
      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model: "anthropic/claude-3-haiku", // ✅ Confirmed to work
          messages: [
            {
              role: "system",
              content: `You are a medical assistant AI. 
Extract key medical search criteria from user queries and respond ONLY with valid JSON. 
Do NOT include any explanation or commentary before or after the JSON.

Return the following fields:
- condition
- district
- specialty
- timePreferences (array: morning, afternoon, evening, weekday, weekend)
- urgency (true/false)
- hospitalPreference
- relatedConditions (array)

Example:
Input: "I have back pain and want a doctor in Narayanganj available on weekdays"
Output:
{
  "condition": "back pain",
  "district": "Narayanganj",
  "specialty": "Orthopedist",
  "timePreferences": ["weekday"],
  "urgency": false,
  "hospitalPreference": null,
  "relatedConditions": ["spinal issues", "muscle strain"]
}

⚠️ IMPORTANT: Respond only with valid JSON, no other text.`,
            },

            { role: "user", content: prompt },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const content = response.data.choices?.[0]?.message?.content;
      console.log(content);
      return JSON.parse(content);
    } catch (error: any) {
      console.error(
        "OpenRouter AI Error:",
        error.response?.data || error.message
      );
      throw new Error("Failed to analyze prompt with OpenRouter AI");
    }
  },

  extractSearchCriteria(aiResponse: any) {
    const criteria: any = {};

    // Map AI response to our search criteria
    if (aiResponse.condition) {
      criteria.condition = aiResponse.condition;
    }

    if (aiResponse.district) {
      criteria.district = aiResponse.district.toLowerCase();
    }

    if (aiResponse.specialty) {
      criteria.specialty = aiResponse.specialty;
    }

    // Handle time preferences
    if (aiResponse.timePreferences) {
      criteria.timePreferences = aiResponse.timePreferences;
    }

    return criteria;
  },

  buildMongoQuery(criteria: any) {
    const query: any = { isDeleted: false };
    const orConditions = [];

    // 🌍 District filter
    if (criteria.district) {
      query.district = {
        $regex: new RegExp(criteria.district, "i"),
      };
    }

    // 🧠 Map condition to specialty (AI assistance + fallback dictionary)
    const conditionToSpecialtyMap: Record<string, string> = {
      headache: "Neurology",
      "back pain": "Orthopedics",
      "leg pain": "Orthopedics",
      "chest pain": "Cardiology",
      cancer: "Oncology",
      diabetes: "Endocrinology",
      asthma: "Pulmonology",
      "skin rash": "Dermatology",
      pregnancy: "Gynecology",
      "eye pain": "Ophthalmology",
      // Add more mappings as needed
    };

    const specialtiesToSearch: string[] = [];

    if (criteria.specialty) {
      specialtiesToSearch.push(criteria.specialty);
    }

    if (
      criteria.condition &&
      conditionToSpecialtyMap[criteria.condition.toLowerCase()]
    ) {
      specialtiesToSearch.push(
        conditionToSpecialtyMap[criteria.condition.toLowerCase()]
      );
    }

    if (criteria.relatedConditions?.length) {
      criteria.relatedConditions.forEach((cond: string) => {
        const mapped = conditionToSpecialtyMap[cond.toLowerCase()];
        if (mapped) specialtiesToSearch.push(mapped);
      });
    }

    // Remove duplicates
    const uniqueSpecialties = [...new Set(specialtiesToSearch)];

    if (uniqueSpecialties.length > 0) {
      orConditions.push(
        ...uniqueSpecialties.flatMap((sp) => [
          { specialty: { $regex: sp, $options: "i" } },
          { specialtyList: { $regex: sp, $options: "i" } },
          { specialtyCategories: { $regex: sp, $options: "i" } },
        ])
      );
    }

    if (orConditions.length > 0) {
      query.$or = orConditions;
    }

    // 🕐 Time/day filters (same as your logic)
    if (criteria.timePreferences) {
      const timeConditions = [];
      const timeSlotsConditions = [];

      if (criteria.timePreferences.includes("weekdays")) {
        timeConditions.push({
          "chambers.visiting_hours.visiting_days": {
            $in: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          },
        });
      }

      if (criteria.timePreferences.includes("weekend")) {
        timeConditions.push({
          "chambers.visiting_hours.visiting_days": {
            $in: ["Saturday", "Sunday"],
          },
        });
      }

      if (criteria.timePreferences.includes("morning")) {
        timeSlotsConditions.push({
          $or: [
            { start_time_24hr: { $lte: "12:00" } },
            { original_time: { $regex: /morning|am/i } },
          ],
        });
      }

      if (criteria.timePreferences.includes("afternoon")) {
        timeSlotsConditions.push({
          $or: [
            { start_time_24hr: { $gte: "12:00", $lte: "17:00" } },
            { original_time: { $regex: /afternoon|pm/i } },
          ],
        });
      }

      if (criteria.timePreferences.includes("evening")) {
        timeSlotsConditions.push({
          $or: [
            { start_time_24hr: { $gte: "17:00" } },
            { original_time: { $regex: /evening|night|pm/i } },
          ],
        });
      }

      if (timeSlotsConditions.length > 0) {
        timeConditions.push({
          "chambers.visiting_hours.time_slots": {
            $elemMatch: {
              $and: timeSlotsConditions,
            },
          },
        });
      }

      if (timeConditions.length > 0) {
        query.$and = (query.$and || []).concat({ $or: timeConditions });
      }
    }

    // 🚨 Urgency filter
    if (criteria.urgency === "urgent") {
      query.$and = (query.$and || []).concat([
        {
          "chambers.visiting_hours.visiting_days": {
            $exists: true,
            $not: { $size: 0 },
          },
        },
        {
          $or: [
            { "chambers.visiting_hours.visiting_days.1": { $exists: true } },
            { "chambers.visiting_hours.time_slots.1": { $exists: true } },
          ],
        },
      ]);
    }

    // 🏥 Hospital filter
    if (criteria.hospitalPreference) {
      query["chambers.hospital_name"] = {
        $regex: criteria.hospitalPreference,
        $options: "i",
      };
    }

    return query;
  },
};
