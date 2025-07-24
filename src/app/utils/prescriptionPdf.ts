import PDFDocument from "pdfkit";
import { Response } from "express";
import { IPrescription } from "../../modules/prescription/prescription.interface";

// Helper functions
function getDoctorField(p: any, field: string): string {
  const doc = p.registered_doctor_id || p.doctor_id;
  if (doc && typeof doc === "object" && field in doc) return doc[field];
  return "";
}
function getPatientField(p: any, field: string): string {
  const pat = p.patient_id;
  if (pat && typeof pat === "object" && field in pat) return pat[field];
  return "";
}
function getPatientAge(p: any): string {
  const dob = getPatientField(p, "dob");
  if (!dob) return "";
  const birth = new Date(dob);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  return `${years}y ${months}m`;
}

export function generatePrescriptionPDF(
  prescription: IPrescription,
  res: Response
) {
  const doc = new PDFDocument({ margin: 48, size: "A4" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=prescription.pdf");
  doc.pipe(res);

  // Header: Doctor info (left), Date/Ref (right)
  doc
    .font("Helvetica-Bold")
    .fontSize(15)
    .fillColor("#111")
    .text(getDoctorField(prescription, "name"), 48, 40, { align: "left" });
  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#222")
    .text(getDoctorField(prescription, "degree") || "MBBS", { align: "left" })
    .text(getDoctorField(prescription, "specialty") || "Specialist", {
      align: "left",
    })
    .text("DOCTIME APP Tele Medicine", { align: "left" })
    .text(
      `BMDC Reg. No - ${getDoctorField(prescription, "bmdc_number") || "N/A"}`,
      { align: "left" }
    );

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#111")
    .text(`Date: ${prescription.date}`, 0, 40, { align: "right" })
    .text(
      `Ref: ${
        (prescription as any)._id
          ? (prescription as any)._id.toString().slice(-8).toUpperCase()
          : "N/A"
      }`,
      { align: "right" }
    );

  // Add margin above patient info
  doc.moveDown(2.5);

  // Patient info row with border below
  const patientInfoY = doc.y;
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("#111")
    .text("Patient Name:", 48, patientInfoY, { continued: true })
    .font("Helvetica")
    .text(` ${getPatientField(prescription, "name")}`, { continued: true })
    .font("Helvetica-Bold")
    .text("    Gender:", { continued: true })
    .font("Helvetica")
    .text(` ${getPatientField(prescription, "gender") || "N/A"}`, {
      continued: true,
    })
    .font("Helvetica-Bold")
    .text("    Age:", { continued: true })
    .font("Helvetica")
    .text(` ${getPatientAge(prescription) || "N/A"}`, { continued: true })
    .font("Helvetica-Bold")
    .text("    Weight:", { continued: true })
    .font("Helvetica")
    .text(` ${getPatientField(prescription, "weight") || "N/A"}`);

  // Draw a border under the patient info row
  doc
    .moveTo(48, doc.y + 6)
    .lineTo(doc.page.width - 48, doc.y + 6)
    .strokeColor("#bbb")
    .lineWidth(1)
    .stroke();

  doc.moveDown(2);

  // Chief Complaints (left column)
  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor("#111")
    .text("Chief Complaints:", 48, doc.y, { align: "left" });
  doc.font("Helvetica").fontSize(11).fillColor("#111");
  if (
    prescription.chief_complaints &&
    Array.isArray(prescription.chief_complaints)
  ) {
    prescription.chief_complaints.forEach((c: string) => {
      doc.text(`• ${c}`, 58, doc.y);
    });
  } else if (prescription.advice) {
    doc.text(`• ${prescription.advice}`, 58, doc.y);
  } else {
    doc.text("• [Not specified]", 58, doc.y);
  }

  doc.moveDown(1.5);

  // Rx Section
  doc
    .font("Helvetica-Bold")
    .fontSize(28)
    .fillColor("#111")
    .text("℞", 48, doc.y, { align: "left" });

  doc.moveDown(0.5);

  // Medicines
  prescription.medicines.forEach((med, i) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#111")
      .text(`${i + 1}. ${med.name}`, 70, doc.y);
    if (med.timing) {
      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("#222")
        .text(med.timing, 90, doc.y);
    }
    if (med.instructions) {
      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("#222")
        .text(med.instructions, 90, doc.y);
    }
    if (med.duration) {
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#444")
        .text(med.duration, 90, doc.y);
    }
    // Dotted line after each medicine
    doc
      .moveTo(70, doc.y + 8)
      .lineTo(doc.page.width - 70, doc.y + 8)
      .dash(2, { space: 2 })
      .strokeColor("#bbb")
      .stroke()
      .undash();
    doc.moveDown(1.2);
  });

  // Signature and doctor info at bottom
  doc.moveDown(4);
  // (Optional) Add a signature image here if you want:
  // doc.image("path/to/signature.png", 48, doc.y, { width: 80 });
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#111")
    .text(getDoctorField(prescription, "name"), 48, doc.y, { align: "left" });
  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#222")
    .text(getDoctorField(prescription, "degree") || "MBBS", { align: "left" })
    .text(getDoctorField(prescription, "specialty") || "Specialist", {
      align: "left",
    })
    .text("DOCTIME APP Tele Medicine", { align: "left" });

  // Footer
  doc.moveDown(2);
  doc
    .fontSize(9)
    .fillColor("#888")
    .text("Powered by Doctime Limited", 48, doc.page.height - 45, {
      align: "left",
    })
    .font("Helvetica")
    .fillColor("#888")
    .text(`Page 1 of 1`, doc.page.width - 100, doc.page.height - 45, {
      align: "right",
    });

  doc.end();
}
