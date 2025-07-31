import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  openUI_url: process.env.OPENUI_API_URL,
  smtp_user: process.env.SMTP_USER,
  smtp_pass: process.env.SMTP_PASS,
  jwt_secret: process.env.JWT_SECRET,
  store_id: process.env.SSL_STORE_ID,
  store_pass: process.env.SSL_STORE_PASSWORD,
  ssl_is_live: process.env.SSL_IS_LIVE,
  frontend: process.env.FRONTEND_URL,
  backend: process.env.BACKEND_URL,
};
