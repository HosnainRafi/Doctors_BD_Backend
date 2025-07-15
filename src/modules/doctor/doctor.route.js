"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorRoutes = void 0;
// src/modules/doctor/doctor.routes.ts
const express_1 = __importDefault(require("express"));
const doctor_controller_1 = require("./doctor.controller");
const doctor_validation_1 = require("./doctor.validation");
const validateRequest_1 = require("../../middlewares/validateRequest");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.validateRequest)(doctor_validation_1.doctorValidations.createDoctorValidation), doctor_controller_1.doctorController.createDoctor);
router.get("/", doctor_controller_1.doctorController.getAllDoctors);
router.get("/deleted", doctor_controller_1.doctorController.getDeletedDoctors);
router.get("/:id", doctor_controller_1.doctorController.getSingleDoctor);
router.patch("/:id", (0, validateRequest_1.validateRequest)(doctor_validation_1.doctorValidations.updateDoctorValidation), doctor_controller_1.doctorController.updateDoctor);
router.delete("/:id", doctor_controller_1.doctorController.deleteDoctor);
router.patch("/:id/restore", doctor_controller_1.doctorController.restoreDoctor);
router.post("/import", upload.single("file"), doctor_controller_1.doctorController.importDoctors);
router.post("/ai-search", doctor_controller_1.doctorController.aiDoctorSearch);
exports.DoctorRoutes = router;
