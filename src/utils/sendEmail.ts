import nodemailer from "nodemailer";
import config from "../config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: config.NODE_ENV === "production",
  auth: {
    user: config.smtp_auth_user,
    pass: config.smtp_auth_password,
  },
});

const sendEmail = async (to: string, html: string) => {
  try {
    // send mail with defined transport object
    await transporter.sendMail({
      from: config.node_mailer_email_from,
      to, // list of receivers
      subject: `Reset Your Password within 10 minutes`,
      text: "Reset Your Password within 10 minutes",
      html,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

export default sendEmail;
