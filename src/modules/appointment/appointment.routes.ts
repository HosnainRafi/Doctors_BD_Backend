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
  "/doctor/:doctor_id",
  authDoctor,
  AppointmentController.getDoctorAppointments
);

router.get(
  "/registered-doctor/:registered_doctor_id",
  AppointmentController.getRegisteredDoctorAppointments
);

router.get(
  "/earnings/:registered_doctor_id",
  AppointmentController.getEarnings
);

router.patch(
  "/:id",
  validateRequest(AppointmentValidations.updateAppointmentValidation),
  AppointmentController.updateAppointment
);

router.delete("/:id", AppointmentController.deleteAppointment);

router.post("/:id/reminder", AppointmentController.sendReminder);

export const AppointmentRoutes = router;
