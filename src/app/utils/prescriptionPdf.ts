import PDFDocument from "pdfkit";
import { Response } from "express";
import { IPrescription } from "../../modules/prescription/prescription.interface";

export function generatePrescriptionPDF(
  prescription: IPrescription,
  res: Response
) {
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=prescription.pdf");
  doc.pipe(res);

  doc.fontSize(20).text("Prescription", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Date: ${prescription.date}`);
  doc.text(`Doctor: ${prescription.doctor_id}`);
  doc.text(`Patient: ${prescription.patient_id}`);
  doc.moveDown();

  doc.text("Medicines:");
  prescription.medicines.forEach((med, i) => {
    doc.text(`${i + 1}. ${med.name} (${med.dose}) - ${med.instructions || ""}`);
  });

  if (prescription.advice) {
    doc.moveDown();
    doc.text(`Advice: ${prescription.advice}`);
  }
  if (prescription.follow_up_date) {
    doc.moveDown();
    doc.text(`Follow-up Date: ${prescription.follow_up_date}`);
  }

  doc.end();
}
