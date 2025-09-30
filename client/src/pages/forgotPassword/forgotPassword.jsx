import React, { useState } from "react";
import "./forgotPassword.css";
import { serverURL } from "../../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state
  const navigate = useNavigate();

  // Helper: extract error safely
  const getErrorMessage = (error, fallback = "Something went wrong") => {
    return (
      error.response?.data?.message ||
      error.response?.data ||
      fallback
    ).toString();
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.post(
        `${serverURL}/api/auth/sendotp`,
        { email },
        { withCredentials: true }
      );
      setStep(2);
      setSuccess("OTP sent to your email.");
    } catch (error) {
      setErr(getErrorMessage(error, "Failed to send OTP"));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.post(
        `${serverURL}/api/auth/verifyotp`,
        { email, otp },
        { withCredentials: true }
      );
      setStep(3);
      setSuccess("OTP verified successfully!");
    } catch (error) {
      setErr(getErrorMessage(error, "Invalid OTP"));
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        setErr("Passwords do not match");
        return;
      }
      await axios.post(
        `${serverURL}/api/auth/resetpassword`,
        { email, newPassword: password },
        { withCredentials: true }
      );
      setSuccess("Password reset successful! Redirecting...");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (error) {
      setErr(getErrorMessage(error, "Failed to reset password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-background">
      {/* Step 1: Email Input */}
      {step === 1 && (
        <div className="forgot-container">
          <h1>Forgot Password?</h1>
          <p className="subtext">
            Enter your email address and we’ll send you an OTP to reset your
            password.
          </p>
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {err && <p className="error-message">{err}</p>}
            {success && <p className="success-message">{success}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        </div>
      )}

      {/* Step 2: OTP Verification */}
      {step === 2 && (
        <div className="forgot-container">
          <h1>Verify OTP</h1>
          <p className="subtext">Enter the OTP sent to your email.</p>
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label>OTP</label>
              <input
                type="text"
                className="otp-input"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            {err && <p className="error-message">{err}</p>}
            {success && <p className="success-message">{success}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      )}

      {/* Step 3: Reset Password */}
      {step === 3 && (
        <div className="forgot-container">
          <h1>Reset Password</h1>
          <p className="subtext">Enter your new password.</p>
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>New password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm new password</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {err && <p className="error-message">{err}</p>}
            {success && <p className="success-message">{success}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
