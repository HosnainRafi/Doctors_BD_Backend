import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  openUI_url: process.env.OPENUI_API_URL,
  smtp_user: process.env.SMTP_USER,
  smtp_pass: process.env.SMTP_PASS,
};
