import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  salt_rounds: process.env.SALT_ROUNDS,
  default_password_user: process.env.DEFAULT_PASS_USER,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  jwt_reset_password_secret: process.env.JWT_RESET_PASSWORD_SECRET,
  jwt_reset_password_expires_in: process.env.JWT_RESET_PASSWORD_EXPIRES_IN,
  ui_rest_password_domain: process.env.UI_RESET_PASSWORD_DOMAIN,
  smtp_auth_password: process.env.SMTP_AUTH_PASSWORD,
  smtp_auth_user: process.env.SMTP_AUTH_USER,
  node_mailer_email_from: process.env.NODE_MAILER_EMAIL_FROM,
};
