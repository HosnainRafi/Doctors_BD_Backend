"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctor_route_1 = require("../../modules/doctor/doctor.route");
const hospital_route_1 = require("../../modules/hospital/hospital.route");
const district_route_1 = require("../../modules/district/district.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/doctors",
        route: doctor_route_1.DoctorRoutes,
    },
    {
        path: "/hospitals",
        route: hospital_route_1.HospitalRoutes,
    },
    {
        path: "/districts",
        route: district_route_1.DistrictRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
