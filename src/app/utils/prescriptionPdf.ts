import PDFDocument from "pdfkit";
import { Response } from "express";
import { IPrescription } from "../../modules/prescription/prescription.interface";

// Helper functions
function getDoctorField(p: any, field: string): string {
  // Try to get registered doctor first
  let doc = p.registered_doctor_id;
  // If registered doctor not available, try directory doctor
  if (!doc || typeof doc !== "object") {
    doc = p.doctor_id;
  }
  // If no doctor object found, return empty string
  if (!doc || typeof doc !== "object") {
    return "";
  }
  // Handle special field mappings for registered doctors
  if (p.registered_doctor_id && typeof p.registered_doctor_id === "object") {
    if (field === "degree" && doc.degree_names) {
      return Array.isArray(doc.degree_names)
        ? doc.degree_names.join(", ")
        : doc.degree_names;
    }
    if (field === "specialty" && doc.specialties) {
      return Array.isArray(doc.specialties)
        ? doc.specialties.join(", ")
        : doc.specialties;
    }
  }
  // Direct field access
  if (field in doc) {
    return doc[field];
  }
  return "";
}

function getPatientField(p: any, field: string): string {
  const pat = p.patient_id || p.patient;
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
  // Create document with proper margins
  const doc = new PDFDocument({
    margin: 30, // Reduced margin for more content space
    size: "A4",
  });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=prescription.pdf");
  doc.pipe(res);

  // Function to add header
  function addHeader() {
    // Doctor info (left)
    const doctorName = getDoctorField(prescription, "name");
    const formattedName = doctorName.startsWith("Dr. ")
      ? doctorName
      : `Dr. ${doctorName}`;
    doc
      .font("Helvetica-Bold")
      .fontSize(15)
      .fillColor("#111")
      .text(formattedName, 30, 20, { align: "left" });
    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("#222")
      .text(getDoctorField(prescription, "degree") || "MBBS", { align: "left" })
      .text(getDoctorField(prescription, "specialty") || "General Physician", {
        align: "left",
      })
      .text("DOCTIME APP Tele Medicine", { align: "left" })
      .text(
        `BMDC Reg. No - ${
          getDoctorField(prescription, "bmdc_number") || "96189"
        }`,
        { align: "left" }
      );
    // Date and Ref (right)
    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("#111")
      .text(`Date: ${prescription.date}`, 0, 20, { align: "right" })
      .text(
        `Ref: ${
          (prescription as any)._id
            ? (prescription as any)._id.toString().slice(-8).toUpperCase()
            : "DMZWBAWLKK"
        }`,
        { align: "right" }
      );
  }

  // Function to add patient info
  function addPatientInfo() {
    // Add more space before patient info to position it lower
    doc.moveDown(5.5); // Increased space to lower the patient info

    // Draw a line above the patient info
    const lineY = doc.y;
    doc
      .moveTo(30, lineY)
      .lineTo(doc.page.width - 30, lineY)
      .strokeColor("#bbb")
      .lineWidth(1)
      .stroke();

    // Move down a bit after the line
    doc.moveDown(0.5);

    // Patient info row with border below
    const patientInfoY = doc.y;
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("#111")
      .text("Patient Name:", 30, patientInfoY, { continued: true })
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
      .moveTo(30, doc.y + 6)
      .lineTo(doc.page.width - 30, doc.y + 6)
      .strokeColor("#bbb")
      .lineWidth(1)
      .stroke();

    doc.moveDown(1.5); // Reduced space after patient info
  }

  // Function to add footer
  function addFooter() {
    doc
      .fontSize(9)
      .fillColor("#888")
      .text("Powered by Doctime Limited", 30, doc.page.height - 45, {
        align: "left",
      })
      .font("Helvetica")
      .fillColor("#888")
      .text(
        `DocTime অ্যাপ এ 10% ছাড়ে মেডিসিন অর্ডার করুন। কল করুন ০৯৬১৭ ৮৮ ৫৫ ৯৯`,
        30,
        doc.page.height - 30,
        {
          align: "left",
        }
      )
      .text(`Page 1 of 1`, doc.page.width - 100, doc.page.height - 45, {
        align: "right",
      });
  }

  // Function to draw realistic signature
  function drawRealisticSignature(text: string, x: number, y: number) {
    doc.save();
    doc.translate(x, y);

    // Use a cursive font if available, otherwise use oblique
    try {
      doc.font("Times-Italic").fontSize(20).fillColor("#000080");
    } catch (e) {
      doc.font("Helvetica-Oblique").fontSize(20).fillColor("#000080");
    }

    // Create a more natural signature with varying characteristics
    const words = text.split(" ");
    let currentX = 0;
    let currentY = 0;

    words.forEach((word, wordIndex) => {
      const chars = word.split("");

      chars.forEach((char, i) => {
        // Skip spaces
        if (char === " ") return;

        // Calculate position with natural variations
        const charWidth = doc.widthOfString(char) * 0.7; // Compress width
        const rotation = (Math.random() - 0.5) * 0.3; // Random rotation
        const yOffset = Math.sin(i * 0.8) * 3; // Wave effect

        // Save state, apply transformations, draw character
        doc.save();
        doc.translate(currentX, currentY + yOffset);
        doc.rotate(rotation, { origin: [0, 0] });

        // Vary opacity slightly for natural look
        const opacity = 0.8 + Math.random() * 0.2;
        doc.opacity(opacity);

        doc.text(char, 0, 0, { continued: false });
        doc.restore();

        // Move to next character position with slight variation
        currentX += charWidth + (Math.random() * 2 - 1);
      });

      // Add space between words
      currentX += 15;

      // Add slight vertical variation between words
      currentY += (Math.random() - 0.5) * 2;
    });

    // Add a flourish at the end
    doc.save();
    doc.translate(currentX, currentY);
    doc.rotate(0.5, { origin: [0, 0] });
    doc
      .moveTo(0, 0)
      .bezierCurveTo(10, -5, 20, 5, 30, 0)
      .lineWidth(1.5)
      .strokeColor("#000080")
      .stroke();
    doc.restore();

    doc.restore();
  }

  // === SINGLE PAGE LAYOUT ===
  addHeader();
  addPatientInfo();

  // Chief Complaints section
  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor("#111")
    .text("Chief Complaints:", 30, doc.y, { align: "left" });
  doc.font("Helvetica").fontSize(11).fillColor("#111");
  if (
    prescription.chief_complaints &&
    Array.isArray(prescription.chief_complaints)
  ) {
    prescription.chief_complaints.forEach((c: string) => {
      doc.text(`• ${c}`, 40, doc.y);
    });
  } else if (prescription.advice) {
    doc.text(`• ${prescription.advice}`, 40, doc.y);
  } else {
    doc.text("• [Not specified]", 40, doc.y);
  }
  doc.moveDown(0.8); // Reduced space

  // Rx Section with Rx symbol
  doc
    .font("Helvetica-Bold")
    .fontSize(28)
    .fillColor("#111")
    .text("℞", 30, doc.y, { align: "left" });
  doc.moveDown(0.3); // Reduced space

  // Medicines
  prescription.medicines.forEach((med, i) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#111")
      .text(`${i + 1}. ${med.name}`, 50, doc.y);
    // Timing (e.g., ১+০+১)
    if (med.timing) {
      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("#222")
        .text(med.timing, 70, doc.y);
    }
    // Instructions (e.g., in Bengali)
    if (med.instructions) {
      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("#222")
        .text(med.instructions, 70, doc.y);
    }
    // Duration (e.g., 10 days)
    if (med.duration) {
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#444")
        .text(med.duration, 70, doc.y);
    }
    // Dotted line after each medicine
    doc
      .moveTo(50, doc.y + 6)
      .lineTo(doc.page.width - 50, doc.y + 6)
      .dash(2, { space: 2 })
      .strokeColor("#bbb")
      .stroke()
      .undash();
    doc.moveDown(0.6); // Reduced space between medicines
  });

  // Doctor signature section - moved to right side with top margin
  doc.moveDown(2); // Significant margin at the top of signature section

  // Get doctor name for signature
  const doctorName = getDoctorField(prescription, "name");
  const formattedName = doctorName.startsWith("Dr. ")
    ? doctorName
    : `Dr. ${doctorName}`;

  // Position signature on the right side
  const signatureX = doc.page.width - 250; // Position from right edge
  const signatureY = doc.y;

  // Draw realistic signature
  drawRealisticSignature(formattedName, signatureX, signatureY);

  // Draw a line for signature below the signature text
  doc
    .moveTo(signatureX, signatureY + 30)
    .lineTo(signatureX + 180, signatureY + 30)
    .strokeColor("#000")
    .lineWidth(1)
    .stroke();

  // Add "Signature" text below the line
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#666")
    .text("Signature", signatureX, signatureY + 35, { align: "left" });

  // Add doctor info below the signature
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#111")
    .text(formattedName, signatureX, signatureY + 45, { align: "left" });
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#222")
    .text(getDoctorField(prescription, "degree") || "MBBS", signatureX, doc.y, {
      align: "left",
    })
    .text(
      getDoctorField(prescription, "specialty") || "General Physician",
      signatureX,
      doc.y,
      {
        align: "left",
      }
    )
    .text("DOCTIME APP Tele Medicine", signatureX, doc.y, { align: "left" });

  // Add footer
  //addFooter();

  doc.end();
}
