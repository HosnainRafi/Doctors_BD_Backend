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
import { translateObjectFieldsIfBengali } from "../../shared/translationNew";
import { translateDistrictToEnglish } from "../../shared/translateDistrictToEnglish";
import { smartCleanDistrict } from "../../shared/overrideCurrentDistrict";
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
    if (
      query.specialty &&
      mongoose.Types.ObjectId.isValid(query.specialty as string)
    ) {
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
        {
          specialtyList: {
            $elemMatch: { $regex: query.searchTerm, $options: "i" },
          },
        },
        {
          specialtyCategories: {
            $elemMatch: { $regex: query.searchTerm, $options: "i" },
          },
        },

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
      filter["chambers.visiting_hours.visiting_days"] = {
        $in: [query.visiting_day],
      };
    }

    // Visiting hours filter (partial match)
    if (query.visiting_hours) {
      filter["chambers.visiting_hours.visiting_hours"] = {
        $regex: query.visiting_hours,
        $options: "i",
      };
    }

    // Time slot filter
    // Assume query.time_slot is a 24-hour string like "18:00"
    if (query.time_slot) {
      const inputTime = query.time_slot; // must be in "HH:mm" format like "18:00"

      filter["chambers.visiting_hours.time_slots"] = {
        $elemMatch: {
          start_time_24hr: { $lte: inputTime },
          end_time_24hr: { $gte: inputTime },
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

  async aiSearchDoctors(
    prompt: string, // Already translated to English in the controller!
    fallbackLocation?: string
  ): Promise<{
    data: IDoctorDocument[];
    meta: any;
    searchCriteria: any;
  }> {
    // Step 1: Log the prompt received (should be English)
    console.log("Prompt received by service:", prompt);

    // Step 2: Continue with AI processing
    const aiResponse = await this.analyzePromptWithOpenRouter(prompt);
    console.log("AI response:", aiResponse);

    const searchCriteria = this.extractSearchCriteria(
      aiResponse,
      fallbackLocation || null
    );
    const mongoQuery = this.buildMongoQuery(searchCriteria);
    const doctors = await Doctor.find(mongoQuery).lean();
    console.log("Search criteria:", searchCriteria);

    return {
      data: doctors,
      meta: {
        count: doctors.length,
      },
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
              content: `
You are a medical assistant AI. Your task is to extract key medical search criteria from user queries and respond ONLY with a valid JSON object.

⚠️ VERY IMPORTANT INSTRUCTIONS:

1. **ALWAYS translate non-English (e.g., Bengali) queries to English internally** before processing.
2. **ALL fields in your JSON output must be in ENGLISH.**
3. The "specialty" field is REQUIRED. You MUST map any condition or symptom to a valid specialty. Do not leave it null.
4. If the specialty is unclear or not mentioned, use the most likely one based on the condition. Default to "Medicine Specialist" if unsure.
5. Include urgency = true if the tone or language indicates urgency (e.g., "need urgently", "emergency").
6. If the user mentions a district in Bangla (e.g., "কুষ্টিয়া"), translate it to English ("Kushtia").
7. If the user mentions a location with "around", "near", "beside","of" or similar, ALWAYS use that location as the 'district', even if another location is mentioned with "in". Ignore the "in" location for the main search.

✅ JSON FIELDS (Always include all):
- condition (string)
- district (string)
- specialty (string)
- timePreferences (array of: "morning", "afternoon", "evening", "weekday", "weekend")
- dateRequirement ("today" | "tomorrow" | "specific_date" | null)
- specificDate (format: YYYY-MM-DD or null)
- urgency (true | false)
- hospitalPreference (string or null)
- relatedConditions (array of strings)

📌 EXAMPLES:

Example 1:
User: "I need a doctor for abdominal pain in Dhaka tomorrow"
Response:
{
  "condition": "abdominal pain",
  "district": "Dhaka",
  "specialty": "Gastroenterology",
  "timePreferences": [],
  "dateRequirement": "tomorrow",
  "specificDate": null,
  "urgency": false,
  "hospitalPreference": null,
  "relatedConditions": []
}

Example 2:
User: "আমার পেটে ব্যথা হচ্ছে কুষ্টিয়া তে"
Response:
{
  "condition": "abdominal pain",
  "district": "Kushtia",
  "specialty": "Gastroenterology",
  "timePreferences": [],
  "dateRequirement": null,
  "specificDate": null,
  "urgency": false,
  "hospitalPreference": null,
  "relatedConditions": []
}

ONLY return the JSON object. Do not add any explanation or extra text.
`,
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
      const aiResponse = await translateObjectFieldsIfBengali(
        JSON.parse(content)
      );

      aiResponse.district = smartCleanDistrict(prompt, aiResponse.district);

      // Translate Bengali district if needed
      if (aiResponse.district) {
        aiResponse.district = await translateDistrictToEnglish(
          aiResponse.district
        );
      }

      return aiResponse;
    } catch (error: any) {
      console.error(
        "OpenRouter AI Error:",
        error.response?.data || error.message
      );
      throw new Error("Failed to analyze prompt with OpenRouter AI");
    }
  },

  extractSearchCriteria(
    aiResponse: any,
    fallbackLocation: string | null = null
  ) {
    return {
      condition: aiResponse.condition || null,
      specialty: aiResponse.specialty || null,
      relatedConditions: aiResponse.relatedConditions || [],
      district: aiResponse.district || fallbackLocation || null,
      timePreferences: aiResponse.timePreferences || [],
      hospitalPreference: aiResponse.hospitalPreference || null,
      dateRequirement: aiResponse.dateRequirement || null,
      specificDate: aiResponse.specificDate || null,
      urgency: aiResponse.urgency || false,
    };
  },

  buildMongoQuery(criteria: any) {
    const query: any = { isDeleted: false };
    const orConditions = [];

    const today = new Date();
    let targetDay = null;

    if (criteria.dateRequirement === "today") {
      targetDay = today.toLocaleString("en-US", { weekday: "long" });
    } else if (criteria.dateRequirement === "tomorrow") {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      targetDay = tomorrow.toLocaleString("en-US", { weekday: "long" });
    } else if (criteria.specificDate) {
      const date = new Date(criteria.specificDate);
      targetDay = date.toLocaleString("en-US", { weekday: "long" });
    }

    if (targetDay) {
      query.$and = (query.$and || []).concat([
        { "chambers.visiting_hours.visiting_days": targetDay },
        { "chambers.visiting_hours.closed_days": { $ne: targetDay } },
      ]);
    }

    if (criteria.district) {
      query.district = { $regex: criteria.district, $options: "i" };
    }

    const conditionToSpecialtyMap: Record<string, string> = {
      dentistry: "Dental Specialist",
      dentist: "Dental Specialist",
      teeth: "Dental Specialist",
      tooth: "Dental Specialist",
      gum: "Dental Specialist",
      oral: "Dental Specialist",

      // Pediatrics
      child: "Child Specialist",
      children: "Child Specialist",
      kid: "Child Specialist",
      kids: "Child Specialist",
      baby: "Child Specialist",
      newborn: "Child Specialist",
      pediatric: "Child Specialist",
      pediatrician: "Child Specialist",

      // Neurology
      brain: "Brain Specialist",
      nerve: "Brain Specialist",
      neurology: "Brain Specialist",
      neuromedicine: "Brain Specialist",
      spine: "Brain Specialist",
      stroke: "Brain Specialist",

      // Cardiology
      heart: "Cardiology Specialist",
      cardio: "Cardiology Specialist",
      cardiovascular: "Cardiology Specialist",

      // Orthopedics
      bone: "Orthopedics Specialist",
      joint: "Orthopedics Specialist",
      orthopedic: "Orthopedics Specialist",
      arthritis: "Orthopedics Specialist",
      trauma: "Orthopedics Specialist",

      // Gynecology
      women: "Gynecology Specialist",
      pregnancy: "Gynecology Specialist",
      gynecologist: "Gynecology Specialist",
      obstetrics: "Gynecology Specialist",
      gynae: "Gynecology Specialist",
      infertility: "Gynecology Specialist",

      // ENT
      ear: "ENT Specialist",
      nose: "ENT Specialist",
      throat: "ENT Specialist",
      ent: "ENT Specialist",
      sinus: "ENT Specialist",

      // Ophthalmology
      eye: "Eye Specialist",
      vision: "Eye Specialist",

      // Oncology
      cancer: "Cancer & Tumor Specialist",
      tumor: "Cancer & Tumor Specialist",
      oncology: "Cancer & Tumor Specialist",
      breast: "Cancer & Tumor Specialist",

      // Pulmonology
      chest: "Chest Diseases Specialist",
      asthma: "Chest Diseases Specialist",
      respiratory: "Chest Diseases Specialist",
      cough: "Chest Diseases Specialist",
      lung: "Chest Diseases Specialist",

      // Endocrinology
      diabetes: "Diabetes Specialist",
      sugar: "Diabetes Specialist",
      hormone: "Endocrinology",
      thyroid: "Endocrinology",

      // Rheumatology
      rheumatism: "Rheumatology",
      jointpain: "Rheumatology",

      // Psychiatry
      mental: "Psychiatry",
      depression: "Psychiatry",
      addiction: "Psychiatry",
      psychiatry: "Psychiatry",

      // Dermatology
      skin: "Dermatology",
      rash: "Dermatology",
      allergy: "Dermatology",
      leprosy: "Dermatology",
      eczema: "Dermatology",

      // General
      general: "General Specialist",
      medicine: "Medicine Specialist",

      // Hepatology
      liver: "Hepatology Specialist",
      pancreas: "Hepatology Specialist",
      gallbladder: "Hepatology Specialist",
      jaundice: "Hepatology Specialist",

      // Gastro
      gastro: "Gastro Liver Specialist",
      stomach: "Gastro Liver Specialist",

      // Urology
      kidney: "Kidney Diseases Specialist",
      dialysis: "Kidney Diseases Specialist",
      urine: "Kidney Diseases Specialist",
      prostate: "Kidney Diseases Specialist",

      // Neurosurgery
      neurosurgery: "Neurosurgery",
      skull: "Neurosurgery",
    };

    // --- Specialty mapping ---
    const specialties: string[] = [];

    // 1. From AI
    if (criteria.specialty) specialties.push(criteria.specialty);

    // 2. From condition (exact and partial/fuzzy)
    if (criteria.condition) {
      const cond = criteria.condition.toLowerCase();
      if (conditionToSpecialtyMap[cond]) {
        specialties.push(conditionToSpecialtyMap[cond]);
      } else {
        for (const [key, value] of Object.entries(conditionToSpecialtyMap)) {
          if (cond.includes(key)) {
            specialties.push(value);
          }
        }
      }
    }

    // 3. From related conditions
    for (const cond of criteria.relatedConditions || []) {
      const mapped = conditionToSpecialtyMap[cond.toLowerCase()];
      if (mapped) specialties.push(mapped);
    }

    // Remove duplicates and fallback
    const uniqueSpecialties = [...new Set(specialties)];
    if (uniqueSpecialties.length === 0) {
      uniqueSpecialties.push("Medicine Specialist");
    }

    // Use uniqueSpecialties below...
    if (uniqueSpecialties.length) {
      orConditions.push(
        ...uniqueSpecialties.flatMap((sp) => [
          { specialty: { $regex: sp, $options: "i" } },
          { specialtyList: { $elemMatch: { $regex: sp, $options: "i" } } },
          {
            specialtyCategories: { $elemMatch: { $regex: sp, $options: "i" } },
          },
        ])
      );
    }

    if (orConditions.length) {
      query.$or = orConditions;
    }

    for (const cond of criteria.relatedConditions || []) {
      const mapped = conditionToSpecialtyMap[cond.toLowerCase()];
      if (mapped) specialties.push(mapped);
    }

    // const uniqueSpecialties = [...new Set(specialties)];
    // if (uniqueSpecialties.length) {
    //   orConditions.push(
    //     ...uniqueSpecialties.flatMap((sp) => [
    //       { specialty: { $regex: sp, $options: "i" } },
    //       { specialtyList: { $elemMatch: { $regex: sp, $options: "i" } } },
    //       {
    //         specialtyCategories: { $elemMatch: { $regex: sp, $options: "i" } },
    //       },
    //     ])
    //   );
    // }

    if (orConditions.length) {
      query.$or = orConditions;
    }

    // Time filters (supports overlapping range)
    if (criteria.timePreferences?.length) {
      const timeOr = [];

      const parseTime = (time: string) => time.replace(":", "");

      if (criteria.timePreferences.includes("morning")) {
        timeOr.push({
          "chambers.visiting_hours.time_slots": {
            $elemMatch: {
              start_time_24hr: { $lte: "12:00" },
              end_time_24hr: { $gte: "08:00" },
            },
          },
        });
      }

      if (criteria.timePreferences.includes("afternoon")) {
        timeOr.push({
          "chambers.visiting_hours.time_slots": {
            $elemMatch: {
              start_time_24hr: { $lte: "17:00" },
              end_time_24hr: { $gte: "12:00" },
            },
          },
        });
      }

      if (criteria.timePreferences.includes("evening")) {
        timeOr.push({
          "chambers.visiting_hours.time_slots": {
            $elemMatch: {
              start_time_24hr: { $lte: "22:00" },
              end_time_24hr: { $gte: "17:00" },
            },
          },
        });
      }

      if (timeOr.length) {
        query.$and = (query.$and || []).concat([{ $or: timeOr }]);
      }
    }

    // Hospital filter
    if (criteria.hospitalPreference) {
      query.$and = (query.$and || []).concat([
        {
          $or: [
            {
              "chambers.hospital_name": {
                $regex: new RegExp(criteria.hospitalPreference, "i"),
              },
            },
            {
              workplace: {
                $regex: new RegExp(criteria.hospitalPreference, "i"),
              },
            },
            {
              source_hospital: {
                $regex: new RegExp(criteria.hospitalPreference, "i"),
              },
            },
          ],
        },
      ]);
    }

    // Urgency
    if (criteria.urgency === true) {
      query.$and = (query.$and || []).concat([
        {
          $or: [
            { "chambers.visiting_hours.time_slots.1": { $exists: true } },
            { "chambers.visiting_hours.visiting_days.1": { $exists: true } },
          ],
        },
      ]);
    }

    return query;
  },
};
