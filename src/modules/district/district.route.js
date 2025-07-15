"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistrictRoutes = void 0;
const express_1 = __importDefault(require("express"));
const district_controller_1 = require("./district.controller");
const district_validation_1 = require("./district.validation");
const validateRequest_1 = require("../../middlewares/validateRequest");
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.validateRequest)(district_validation_1.DistrictValidations.createDistrictValidation), district_controller_1.DistrictController.createDistrict);
router.get("/", district_controller_1.DistrictController.getAllDistrict);
// Other routes...
exports.DistrictRoutes = router;
