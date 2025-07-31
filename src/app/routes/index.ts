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
import { UserRoutes } from "../../modules/user/user.routes";
import { ReviewRoutes } from "../../modules/review/review.routes";
import { NotificationRoutes } from "../../modules/notifications/notification.routes";
import { MedexRoutes } from "../../modules/medex/medex.routes";
import { TransactionRoutes } from "../../modules/transaction/transaction.routes";

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
    path: "/medex",
    route: MedexRoutes,
  },
  {
    path: "/specialtyCategory",
    route: SpecialtyCategoryRoutes,
  },
  {
    path: "/appointments",
    route: AppointmentRoutes,
  },
  {
    path: "/patients",
    route: PatientRoutes,
  },
  {
    path: "/prescriptions",
    route: PrescriptionRoutes,
  },
  {
    path: "/followups",
    route: FollowUpRoutes,
  },
  {
    path: "/registered-doctors",
    route: RegisteredDoctorRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
  {
    path: "/notifications",
    route: NotificationRoutes,
  },
  {
    path: "/payment",
    route: TransactionRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
