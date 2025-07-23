import nodemailer from "nodemailer";
import config from "../config";

export async function sendEmail(to: string, subject: string, text: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
  });
}
