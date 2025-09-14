import React, { useState } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "./../../App";

const SignUp = () => {
  const [role, setRole] = useState("buyer");
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${serverURL}/api/auth/signup`,
        {
          fullName,
          email,
          password,
          mobile
        },
        { withCredentials: true }
      );

      console.log(response);
    } catch (error) {
      console.log(error);
      alert("Sign up failed. Please try again.");
    }
  };

  return (
    <div className="signup-background">
      <div className="signup-container">
        <h1>FRESHY</h1>
        <p className="subtext">Create an account to buy fresh produce</p>

        {/* ✅ onSubmit used here */}
        <form onSubmit={handleSignUp}>
          {/* Full Name */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Mobile Number */}
          <div className="form-group">
            <label>Mobile number</label>
            <input
              type="text"
              onChange={(e) => setMobile(e.target.value)}
              value={mobile}
              placeholder="Enter your mobile number"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              placeholder="Re-enter your password"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label>Select Role</label>
            <div className="role-selection">
              <button
                type="button"
                className={`role-btn ${role === "buyer" ? "active" : ""}`}
                onClick={() => setRole("buyer")}
              >
                Buyer
              </button>
              <button type="button" className="role-btn disabled" disabled>
                Farmer
              </button>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="form-group terms">
            <input
              type="checkbox"
              id="terms"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <label htmlFor="terms">
              I agree to the{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Terms & Conditions
              </a>
            </label>
          </div>

          {/* Sign up with Google Button */}
          <div className="form-group">
            <button type="button" className="google-signup-btn">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google icon"
              />
              Sign up with Google
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={!agree}>
            Create Account
          </button>

          {/* Login Link */}
          <p className="login-link" onClick={() => navigate("/signin")}>
            Already have an account? <a>Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
