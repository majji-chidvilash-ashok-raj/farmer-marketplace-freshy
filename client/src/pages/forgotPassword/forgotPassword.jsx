import React, { useState } from 'react';
import "./forgotPassword.css";
import { serverURL } from '../../App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${serverURL}/api/auth/sendotp`, { email }, { withCredentials: true });
      setStep(2);
    } catch (error) {
  if (error.response) {
    console.error("Backend error:", error.response.data);
  } else if (error.request) {
    console.error("No response from server:", error.request);
  } else {
    console.error("Axios error:", error.message);
  }
}
  }


  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${serverURL}/api/auth/verifyotp`, { email, otp }, { withCredentials: true });
      setStep(3);
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      await axios.post(`${serverURL}/api/auth/resetpassword`, { email, newPassword: password }, { withCredentials: true });
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="signup-background">
      {step === 1 && (
        <div className="signup-container">
          <h1>Forgot Password?</h1>
          <p className="subtext">Enter your email address and we’ll send you an OTP to reset your password.</p>
          <form>
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
            <button type="submit" onClick={handleSendOtp}>Send OTP</button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="signup-container">
          <h1>Verify OTP</h1>
          <p className="subtext">Enter OTP sent to your email.</p>
          <form>
            <div className="form-group">
              <label>OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button onClick={handleVerifyOtp}>Verify</button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="signup-container">
          <h1>Reset Password</h1>
          <p className="subtext">Enter your new password.</p>
          <form>
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
            <button onClick={handleResetPassword}>Reset Password</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
