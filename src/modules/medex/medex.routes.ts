import express from "express";
import { MedexController } from "./medex.controller";

const router = express.Router();

router.get("/search", MedexController.searchMedex);
router.get("/details", MedexController.getMedicineDetails); // ✅ THIS MUST EXIST

export const MedexRoutes = router;
