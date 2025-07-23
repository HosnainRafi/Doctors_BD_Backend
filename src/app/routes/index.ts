import { Router } from "express";
import { DoctorRoutes } from "../../modules/doctor/doctor.route";
import { HospitalRoutes } from "../../modules/hospital/hospital.route";
import { DistrictRoutes } from "../../modules/district/district.route";
import { SpecialtyCategoryRoutes } from "../../modules/specialtyCategory/specialtyCategory.routes";
import { AppointmentRoutes } from "../../modules/appointment/appointment.routes";
import { PatientRoutes } from "../../modules/patient/patient.routes";
import { FollowUpRoutes } from "../../modules/followup/followup.routes";
import { PrescriptionRoutes } from "../../modules/prescription/prescription.routes";
import { RegisteredDoctorRoutes } from "../../modules/registeredDoctor/registeredDoctor.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/doctors",
    route: DoctorRoutes,
  },
  {
    path: "/hospitals",
    route: HospitalRoutes,
  },
  {
    path: "/districts",
    route: DistrictRoutes,
  },
  {
    path: "/specialtyCategory",
    route: SpecialtyCategoryRoutes,
  },
  {
    path: "/appointment",
    route: AppointmentRoutes,
  },
  {
    path: "/patient",
    route: PatientRoutes,
  },
  {
    path: "/prescription",
    route: PrescriptionRoutes,
  },
  {
    path: "/followup",
    route: FollowUpRoutes,
  },
  {
    path: "/registered-doctors",
    route: RegisteredDoctorRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
