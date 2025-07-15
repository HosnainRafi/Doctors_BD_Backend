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
exports.SpecializationService = void 0;
const specialization_model_1 = require("./specialization.model");
exports.SpecializationService = {
    createSpecialization(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield specialization_model_1.Specialization.create(payload);
        });
    },
    getSpecializations() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            return yield specialization_model_1.Specialization.find(filters);
        });
    },
    searchSpecializations(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield specialization_model_1.Specialization.find({
                $text: { $search: query },
            });
        });
    },
    // Add update, delete methods as needed
};
