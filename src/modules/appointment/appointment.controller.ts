import { Request, Response } from "express";
import { AppointmentService } from "./appointment.service";
import { AppointmentValidations } from "./appointment.validation";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { sendEmail } from "../../app/utils/sendEmail";
import { Notification } from "../notifications/notification.model";
// adjust path

const createAppointment = catchAsync(async (req: Request, res: Response) => {
  const body = AppointmentValidations.createAppointmentValidation.parse(
    req.body
  );
  const result = await AppointmentService.createAppointment(body);

  // Helper to check if value is a populated object (not string/ObjectId)
  function isPopulated(
    obj: any
  ): obj is { _id?: any; name?: string; email?: string; phone?: string } {
    return (
      obj &&
      typeof obj === "object" &&
      ("_id" in obj || "name" in obj || "email" in obj || "phone" in obj)
    );
  }

  // Populate both doctor types and patient
  const populated = await AppointmentService.getAppointment(
    result._id as string
  );

  if (!populated) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Appointment not found after creation",
      data: null,
    });
  }

  // Prefer registered doctor if present, else directory doctor
  const doctor = populated.registered_doctor_id || populated.doctor_id;
  const patient = populated.patient_id as any;

  // Notify doctor (if you have their email)
  if (isPopulated(doctor) && doctor.email) {
    await sendEmail(
      doctor.email,
      "New Appointment Booked",
      `You have a new appointment with patient ${
        patient?.name || (isPopulated(patient) ? patient._id : patient)
      } on ${populated?.date} at ${populated?.time}.`
    );
  }

  // Notify patient (if you have their email)
  if (isPopulated(patient) && patient.email) {
    await sendEmail(
      patient.email,
      "Appointment Confirmation",
      `Your appointment with Dr. ${
        isPopulated(doctor) ? doctor.name : doctor
      } is booked for ${populated?.date} at ${populated?.time}.`
    );
  }

  // Notify doctor (WhatsApp)
  // if (isPopulated(doctor) && doctor.phone) {
  //   try {
  //     await sendWhatsapp(
  //       doctor.phone,
  //       `New appointment with patient ${
  //         isPopulated(patient) ? patient.name : patient
  //       } on ${populated?.date} at ${populated?.time}.`
  //     );
  //   } catch (err) {
  //     console.error("Failed to send WhatsApp to doctor:", err);
  //   }
  // }

  // Notify patient (WhatsApp)
  // if (isPopulated(patient) && patient.phone) {
  //   try {
  //     await sendWhatsapp(
  //       patient.phone,
  //       `Your appointment with Dr. ${
  //         isPopulated(doctor) ? doctor.name : doctor
  //       } is booked for ${populated?.date} at ${populated?.time}.`
  //     );
  //   } catch (err) {
  //     console.error("Failed to send WhatsApp to patient:", err);
  //   }
  // }

  // Create notification for user
  await Notification.create({
    user_id: populated.user_id,
    type: "appointment",
    message: `Your appointment with Dr. ${
      isPopulated(doctor) ? doctor.name : doctor
    } is booked for ${populated?.date} at ${populated?.time}.`,
    isRead: false,
    link: `/user/dashboard`,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Appointment created and notifications sent",
    data: populated,
  });
});

const getAppointments = catchAsync(async (req: Request, res: Response) => {
  const result = await AppointmentService.getAppointments(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointments retrieved successfully",
    data: result,
  });
});

const getAppointment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await AppointmentService.getAppointment(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment retrieved successfully",
    data: result,
  });
});

const getDoctorAppointments = catchAsync(
  async (req: Request, res: Response) => {
    const { doctor_id } = req.params;
    const appointments = await AppointmentService.getAppointmentsByDoctor(
      doctor_id
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Appointments for doctor retrieved",
      data: appointments,
    });
  }
);

const getRegisteredDoctorAppointments = catchAsync(
  async (req: Request, res: Response) => {
    const { registered_doctor_id } = req.params;
    const appointments =
      await AppointmentService.getAppointmentsByRegisteredDoctor(
        registered_doctor_id
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Appointments for registered doctor retrieved",
      data: appointments,
    });
  }
);

const updateAppointment = catchAsync(async (req: Request, res: Response) => {
  const body = AppointmentValidations.updateAppointmentValidation.parse(
    req.body
  );
  const result = await AppointmentService.updateAppointment(
    req.params.id,
    body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment updated successfully",
    data: result,
  });
});

const deleteAppointment = catchAsync(async (req: Request, res: Response) => {
  const result = await AppointmentService.deleteAppointment(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment deleted successfully",
    data: result,
  });
});

const getEarnings = catchAsync(async (req, res) => {
  const { registered_doctor_id } = req.params;
  const earnings = await AppointmentService.getEarningsByDoctor(
    registered_doctor_id
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Earnings retrieved",
    data: earnings,
  });
});

const sendReminder = catchAsync(async (req: Request, res: Response) => {
  console.log(req.params);
  const { id } = req.params;
  await AppointmentService.sendReminder(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reminder sent successfully",
    data: null,
  });
});

export const AppointmentController = {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getDoctorAppointments,
  getRegisteredDoctorAppointments,
  getEarnings,
  sendReminder,
};
