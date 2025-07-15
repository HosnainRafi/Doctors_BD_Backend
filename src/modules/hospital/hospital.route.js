"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalRoutes = void 0;
// hospital.routes.ts
const express_1 = __importDefault(require("express"));
const hospital_controller_1 = require("./hospital.controller");
const hospital_validation_1 = require("./hospital.validation");
const validateRequest_1 = require("../../middlewares/validateRequest");
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.validateRequest)(hospital_validation_1.HospitalValidations.createHospitalValidation), hospital_controller_1.HospitalController.createHospital);
router.get("/", hospital_controller_1.HospitalController.getHospitals);
router
    .route("/:id")
    .get(hospital_controller_1.HospitalController.getHospital)
    .patch((0, validateRequest_1.validateRequest)(hospital_validation_1.HospitalValidations.updateHospitalValidation), hospital_controller_1.HospitalController.updateHospital)
    .delete(hospital_controller_1.HospitalController.deleteHospital);
exports.HospitalRoutes = router;
