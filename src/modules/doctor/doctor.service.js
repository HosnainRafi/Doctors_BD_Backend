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
exports.DoctorServices = void 0;
// src/modules/doctor/doctor.service.ts
const doctor_model_1 = require("./doctor.model");
const mongoose_1 = __importDefault(require("mongoose"));
const doctorSpecialization_model_1 = require("../doctor-specialization/doctorSpecialization.model");
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../app/config"));
// adjust path if needed
exports.DoctorServices = {
    // Create Doctor
    createDoctor: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        return yield doctor_model_1.Doctor.create(payload);
    }),
    updateDoctor: (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        return yield doctor_model_1.Doctor.findOneAndUpdate({ id }, payload, {
            new: true,
            runValidators: true,
        });
    }),
    getAllDoctors: (query) => __awaiter(void 0, void 0, void 0, function* () {
        const filter = { isDeleted: false };
        console.log(query);
        // Basic filters
        if (query.district)
            filter.district = query.district;
        // Specialty filter
        if (query.specialty) {
            const specializations = yield doctorSpecialization_model_1.DoctorSpecialization.find({
                specialization: new mongoose_1.default.Types.ObjectId(query.specialty),
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
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;
        // Sorting
        const sortBy = query.sortBy || "createdAt";
        const sortOrder = query.sortOrder === "asc" ? 1 : -1;
        const sort = { [sortBy]: sortOrder };
        // Execute query with pagination
        const [doctors, total] = yield Promise.all([
            doctor_model_1.Doctor.find(filter).sort(sort).skip(skip).limit(limit).lean(),
            doctor_model_1.Doctor.countDocuments(filter),
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
    }),
    getSingleDoctor: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const [doctor] = yield doctor_model_1.Doctor.aggregate([
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
    }),
    deleteDoctor: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield doctor_model_1.Doctor.findOneAndUpdate({ id, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true });
    }),
    restoreDoctor: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield doctor_model_1.Doctor.findOneAndUpdate({ id, isDeleted: true }, { $set: { isDeleted: false, deletedAt: null } }, { new: true });
    }),
    getDeletedDoctors: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield doctor_model_1.Doctor.find({ isDeleted: true }).lean();
    }),
    aiSearchDoctors(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            const aiResponse = yield this.analyzePromptWithOpenRouter(prompt);
            const searchCriteria = this.extractSearchCriteria(aiResponse);
            const mongoQuery = this.buildMongoQuery(searchCriteria);
            const doctors = yield doctor_model_1.Doctor.find(mongoQuery).lean();
            return {
                data: doctors,
                meta: {},
                searchCriteria,
            };
        });
    },
    analyzePromptWithOpenRouter(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const OPENROUTER_API_KEY = config_1.default.openUI_url;
            const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
            try {
                const response = yield axios_1.default.post(OPENROUTER_API_URL, {
                    model: "anthropic/claude-3-haiku", // ✅ Confirmed to work
                    messages: [
                        {
                            role: "system",
                            content: `You are a medical assistant AI. Extract key medical search criteria from user queries and respond ONLY with valid JSON. 
  Include date-related information when users mention "today", "tomorrow" or specific days.
  
  Return the following fields:
  - condition
  - district
  - specialty
  - timePreferences (array: morning, afternoon, evening, weekday, weekend)
  - dateRequirement (enum: null, "today", "tomorrow", "specific_date")
  - specificDate (string in YYYY-MM-DD format if applicable)
  - urgency (true/false)
  - hospitalPreference
  - relatedConditions (array)`,
                        },
                        { role: "user", content: prompt },
                    ],
                }, {
                    headers: {
                        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                });
                const content = (_c = (_b = (_a = response.data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
                console.log(content);
                return JSON.parse(content);
            }
            catch (error) {
                console.error("OpenRouter AI Error:", ((_d = error.response) === null || _d === void 0 ? void 0 : _d.data) || error.message);
                throw new Error("Failed to analyze prompt with OpenRouter AI");
            }
        });
    },
    extractSearchCriteria(aiResponse) {
        const criteria = {};
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
    buildMongoQuery(criteria) {
        var _a;
        const query = { isDeleted: false };
        const orConditions = [];
        // Add at the beginning of buildMongoQuery:
        const today = new Date();
        let targetDay = null;
        if (criteria.dateRequirement === "today") {
            targetDay = today.toLocaleString("en-US", { weekday: "long" });
        }
        else if (criteria.dateRequirement === "tomorrow") {
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            targetDay = tomorrow.toLocaleString("en-US", { weekday: "long" });
        }
        else if (criteria.specificDate) {
            const specificDate = new Date(criteria.specificDate);
            targetDay = specificDate.toLocaleString("en-US", { weekday: "long" });
        }
        if (targetDay) {
            query.$and = (query.$and || []).concat({
                "chambers.visiting_hours.visiting_days": targetDay,
            });
            // Check if the chamber is not listed in closed_days
            query.$and.push({
                "chambers.visiting_hours.closed_days": { $ne: targetDay },
            });
        }
        // 🌍 District filter
        if (criteria.district) {
            query.district = {
                $regex: new RegExp(criteria.district, "i"),
            };
        }
        // 🧠 Map condition to specialty (AI assistance + fallback dictionary)
        const conditionToSpecialtyMap = {
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
        const specialtiesToSearch = [];
        if (criteria.specialty) {
            specialtiesToSearch.push(criteria.specialty);
        }
        if (criteria.condition &&
            conditionToSpecialtyMap[criteria.condition.toLowerCase()]) {
            specialtiesToSearch.push(conditionToSpecialtyMap[criteria.condition.toLowerCase()]);
        }
        if ((_a = criteria.relatedConditions) === null || _a === void 0 ? void 0 : _a.length) {
            criteria.relatedConditions.forEach((cond) => {
                const mapped = conditionToSpecialtyMap[cond.toLowerCase()];
                if (mapped)
                    specialtiesToSearch.push(mapped);
            });
        }
        // Remove duplicates
        const uniqueSpecialties = [...new Set(specialtiesToSearch)];
        if (uniqueSpecialties.length > 0) {
            orConditions.push(...uniqueSpecialties.flatMap((sp) => [
                { specialty: { $regex: sp, $options: "i" } },
                { specialtyList: { $regex: sp, $options: "i" } },
                { specialtyCategories: { $regex: sp, $options: "i" } },
            ]));
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
            if (query.$and &&
                query.$and.some((cond) => cond["chambers.visiting_hours.visiting_days"])) {
                // If we're searching for a specific day, also match the time slots
                query.$and.push({
                    "chambers.visiting_hours.time_slots": {
                        $elemMatch: {
                            $or: timeSlotsConditions,
                        },
                    },
                });
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
            const hospitalQuery = {
                $or: [
                    {
                        "chambers.hospital_name": {
                            $regex: `\\b${criteria.hospitalPreference}\\b`,
                            $options: "i",
                        },
                    },
                    {
                        workplace: {
                            $regex: `\\b${criteria.hospitalPreference}\\b`,
                            $options: "i",
                        },
                    },
                    {
                        source_hospital: {
                            $regex: `\\b${criteria.hospitalPreference}\\b`,
                            $options: "i",
                        },
                    },
                ],
            };
            // Add to main query
            query.$and = (query.$and || []).concat(hospitalQuery);
        }
        return query;
    },
};
