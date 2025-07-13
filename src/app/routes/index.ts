import { Router } from "express";
import { DoctorRoutes } from "../../modules/doctor/doctor.route";
import { HospitalRoutes } from "../../modules/hospital/hospital.route";
import { DistrictRoutes } from "../../modules/district/district.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
