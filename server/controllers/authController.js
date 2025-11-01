import { sendLoginInfo, sendOtpMail, sendPassMail, sendWelcomeMail } from "../middlewares/mail.js";
import Token from "../middlewares/verifyToken.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

// ====================== SIGN UP ======================
export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body; // ✅ include role
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (mobile.length < 10) {
      return res
        .status(400)
        .json({ message: "Mobile number must be at least 10 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      role, // ✅ save role
    });

    const token = await Token(user._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    await sendWelcomeMail(email, fullName);

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

// ====================== SIGN IN ======================
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await Token(user._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    await sendLoginInfo(email);

    return res.status(200).json({ message: "signIn successfull" });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

// ====================== SIGN OUT ======================
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Signout successfull" });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};


// ====================== SEND OTP ======================
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;
    await user.save();

    console.log("Generated OTP:", otp, "for", email);
    await sendOtpMail(email, otp);

    return res.status(200).json({ message: "OTP sent to your mail" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

// ====================== VERIFY OTP ======================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

// ====================== RESET PASSWORD ======================
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "OTP verification required" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.isOtpVerified = false; // reset BEFORE saving
    await user.save();
    await sendPassMail(email);

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "server error" });
  }
};

// ====================== GOOGLE AUTH ======================
export const googleAuth = async (req, res) => {
  try {
    const { fullName, email, mobile, role } = req.body; // ✅ include role

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        fullName,
        email,
        mobile,
        role, // ✅ save role
      });
    }

    const token = await Token(user._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    user.password = undefined; // never send password back
    return res.status(200).json({ message: "Google auth success", user });
  } catch (error) {
    console.error("Google auth error:", error);
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};



// ====================== SEND SIGNUP OTP ======================
export const sendSignupOtp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;

    // check if user already exists
    let existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    if (mobile.length < 10) {
      return res.status(400).json({ message: "Mobile number must be at least 10 characters" });
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Temporarily save signup data + OTP in a separate collection or in-memory
    req.app.locals.signupOtpData = {
      fullName,
      email,
      password,
      mobile,
      role,
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    };

    console.log("Signup OTP:", otp, "for", email);
    await sendOtpMail(email, otp);

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Signup OTP error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ====================== VERIFY SIGNUP OTP ======================
export const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const signupData = req.app.locals.signupOtpData;

    if (
      !signupData ||
      signupData.email !== email ||
      signupData.otp !== otp ||
      signupData.expires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash password & create user
    const hashedPassword = await bcrypt.hash(signupData.password, 10);
    await User.create({
      fullName: signupData.fullName,
      email: signupData.email,
      password: hashedPassword,
      mobile: signupData.mobile,
      role: signupData.role,
    });

    // clear saved OTP
    req.app.locals.signupOtpData = null;

    return res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Verify signup OTP error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

