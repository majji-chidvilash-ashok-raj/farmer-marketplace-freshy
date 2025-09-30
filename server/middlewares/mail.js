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

export const sendLoginInfo = async (to) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.FRESHY_EMAIL,
      to,
      subject: "FRESHY Account Login Notification",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">FRESHY Account Notification</h2>
          <p>Dear User,</p>
          <p>We detected a login to your FRESHY account associated with <strong>${to}</strong>.</p>
          <p>If this was you, no action is required. However, if you did not initiate this login, we strongly recommend that you change your password immediately to secure your account.</p>
          <p>Thank you for using FRESHY.</p>
          <p>Best regards,<br/><strong>The FRESHY Team</strong></p>
        </div>
      `,
    });

    console.log("Login info email sent:", info.messageId);
  } catch (error) {
    console.error("sendLoginInfo error:", error);
    throw error;
  }
};


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
