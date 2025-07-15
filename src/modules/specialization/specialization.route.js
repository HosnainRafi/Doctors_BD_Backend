"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecializationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const specialization_controller_1 = require("./specialization.controller");
const specialization_validation_1 = require("./specialization.validation");
const validateRequest_1 = require("../../middlewares/validateRequest");
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.validateRequest)(specialization_validation_1.SpecializationValidations.createSpecializationValidation), specialization_controller_1.SpecializationController.createSpecialization);
// router.get("/", SpecializationController.getSpecializations);
// router.get("/search", SpecializationController.searchSpecializations);
exports.SpecializationRoutes = router;
