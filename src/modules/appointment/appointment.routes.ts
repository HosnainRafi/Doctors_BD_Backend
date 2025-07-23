import express from "express";
import { AppointmentController } from "./appointment.controller";
import { AppointmentValidations } from "./appointment.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { authDoctor } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  validateRequest(AppointmentValidations.createAppointmentValidation),
  AppointmentController.createAppointment
);

router.get("/", AppointmentController.getAppointments);
router.get("/:id", AppointmentController.getAppointment);
router.get(
  "/doctor/:doctor_id/appointments",
  AppointmentController.getDoctorAppointments
);
// appointment.routes.ts
router.get("/doctor/:doctor_id", AppointmentController.getDoctorAppointments);

router.patch(
  "/:id",
  validateRequest(AppointmentValidations.updateAppointmentValidation),
  AppointmentController.updateAppointment
);

router.delete("/:id", AppointmentController.deleteAppointment);
router.get(
  "/doctor/:doctor_id",
  authDoctor,
  AppointmentController.getDoctorAppointments
);
router.get(
  "/registered-doctor/:registered_doctor_id",
  AppointmentController.getRegisteredDoctorAppointments
);

export const AppointmentRoutes = router;
