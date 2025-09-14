import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // ✅ correct
  auth: {
    user: process.env.FRESHY_EMAIL,
    pass: process.env.FRESHY_APP_PASS,
  },
});

// verify transporter connection
transporter.verify(function (error, success) {
  if (error) {
    console.error("Nodemailer transporter error:", error);
  } else {
    console.log("Server is ready to take messages:", success);
  }
});

export const sendOtpMail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.FRESHY_EMAIL,
      to,
      subject: "Password Reset OTP",
      html: `<p>Your OTP for password reset is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
    });
    console.log("Mail sent:", info.messageId);
  } catch (err) {
    console.error("sendOtpMail error:", err);
    throw err; // rethrow so controller can catch
  }
};
