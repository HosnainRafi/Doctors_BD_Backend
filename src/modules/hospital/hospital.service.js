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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalService = void 0;
const hospital_model_1 = require("./hospital.model");
const calculatePagination_1 = require("../../shared/calculatePagination");
exports.HospitalService = {
    createHospital(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield hospital_model_1.Hospital.create(payload);
        });
    },
    getHospitals(filters, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, page, skip } = (0, calculatePagination_1.calculatePagination)(options);
            const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
            const andConditions = [{ isDeleted: false }]; // Default filter
            if (searchTerm) {
                andConditions.push({
                    $or: [
                        { name: { $regex: searchTerm, $options: "i" } },
                        { address: { $regex: searchTerm, $options: "i" } },
                    ],
                });
            }
            Object.entries(filterData).forEach(([field, value]) => {
                andConditions.push({ [field]: value });
            });
            const whereCondition = andConditions.length > 0 ? { $and: andConditions } : {};
            console.log("Final whereCondition:", JSON.stringify(whereCondition, null, 2));
            const [hospitals, total] = yield Promise.all([
                hospital_model_1.Hospital.find(whereCondition)
                    .skip(skip)
                    .limit(limit)
                    .sort(options.sortBy
                    ? { [options.sortBy]: options.sortOrder === "asc" ? 1 : -1 }
                    : {}),
                hospital_model_1.Hospital.countDocuments(whereCondition),
            ]);
            return {
                meta: { page, limit, total },
                data: hospitals,
            };
        });
    },
    getHospital(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return hospital_model_1.Hospital.findOne({ _id: id, isDeleted: false });
        });
    },
    updateHospital(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return hospital_model_1.Hospital.findByIdAndUpdate(id, payload, { new: true });
        });
    },
    deleteHospital(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return hospital_model_1.Hospital.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        });
    },
};
