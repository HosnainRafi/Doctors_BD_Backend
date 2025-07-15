"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorValidations = exports.updateDoctorValidation = exports.createDoctorValidation = void 0;
// src/modules/doctor/doctor.validation.ts
const zod_1 = require("zod");
const timeSlotValidation = zod_1.z.object({
    start_time_24hr: zod_1.z.string(),
    end_time_24hr: zod_1.z.string(),
    original_time: zod_1.z.string(),
});
const visitingHoursValidation = zod_1.z.object({
    visiting_days: zod_1.z.array(zod_1.z.string()),
    visiting_hours: zod_1.z.array(zod_1.z.string()),
    closed_days: zod_1.z.array(zod_1.z.string()),
    original_text: zod_1.z.string(),
    time_slots: zod_1.z.array(timeSlotValidation),
});
const chamberValidation = zod_1.z.object({
    hospital_name: zod_1.z.string(),
    address: zod_1.z.string(),
    appointment_contact: zod_1.z.string(),
    visiting_hours: visitingHoursValidation,
    url: zod_1.z.string().url(),
});
exports.createDoctorValidation = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string(),
        district: zod_1.z.string(),
        name: zod_1.z.string(),
        photo: zod_1.z.string().url(),
        degree: zod_1.z.string(),
        specialty: zod_1.z.string(),
        workplace: zod_1.z.string(),
        hospital_name: zod_1.z.string(),
        hospital_link: zod_1.z.string().url(),
        rating: zod_1.z.string(),
        chambers: zod_1.z.array(chamberValidation),
        profile_url: zod_1.z.string().url(),
        designation: zod_1.z.string(),
        source_hospital: zod_1.z.string(),
        specialtyList: zod_1.z.array(zod_1.z.string()),
        specialtyCategories: zod_1.z.array(zod_1.z.string()),
    }),
});
exports.updateDoctorValidation = zod_1.z.object({
    body: exports.createDoctorValidation.shape.body.partial(),
    params: zod_1.z.object({
        id: zod_1.z.string(),
    }),
});
exports.doctorValidations = {
    createDoctorValidation: exports.createDoctorValidation,
    updateDoctorValidation: exports.updateDoctorValidation,
};
