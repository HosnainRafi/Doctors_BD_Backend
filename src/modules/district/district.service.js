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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistrictService = void 0;
// src/modules/district/district.service.ts
const district_model_1 = require("./district.model");
exports.DistrictService = {
    // Update the parameter type to use IDistrictInput
    createDistrict: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        return yield district_model_1.District.create(payload);
    }),
    // Other service methods...
    getAllDistricts: (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}) {
        return yield district_model_1.District.find(filters);
    }),
};
