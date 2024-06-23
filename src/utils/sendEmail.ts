import nodemailer from "nodemailer";
import config from "../config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: config.NODE_ENV === "production",
  auth: {
    user: "noyonrahman2003@gmail.com",
    pass: "bjhm gifa hrrq mxzv",
  },
});

const sendEmail = async (to: string, html: string) => {
  try {
    // send mail with defined transport object
    await transporter.sendMail({
      from: "noyonrahman2003@gmail.com",
      to, // list of receivers
      subject: `Reset Your Password within 10 minutes`,
      text: "Reset Your Password within 10 minutes",
      html,
    });
  } catch (error) {
    console.log(error);
  }
};

export default sendEmail;
