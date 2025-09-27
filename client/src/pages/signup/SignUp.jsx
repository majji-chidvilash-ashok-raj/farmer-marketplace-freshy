import React, { useState } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "./../../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../firebase";

const SignUp = () => {
  const [role, setRole] = useState("buyer");
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [err, setErr] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }
    if(!agree){
      setErr("You must agree to Terms & Conditions")
      return
    }

    try {
      const response = await axios.post(
        `${serverURL}/api/auth/signup`,
        { fullName, email, password, mobile, role },
        { withCredentials: true }
      );
      setErr("");
      // Redirect or show success message
      navigate("/signin");
    } catch (error) {
      setErr(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    if (!mobile) {
      return setErr("Mobile number is required");
    }

    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const { data } = await axios.post(
        `${serverURL}/api/auth/googleauth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          mobile,
          role,
        },
        { withCredentials: true }
      );
      console.log(data);
      setErr("");
      navigate("/signin");
    } catch (error) {
      setErr(error.response?.data?.message || "Google Sign-In failed");
    }
  };

  return (
    <div className="signup-background">
      <div className="signup-container">
        <h1>FRESHY</h1>
        <p className="subtext">Create an account to buy fresh produce</p>

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
            <button
              type="button"
              className="google-signup-btn"
              onClick={handleGoogleAuth}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google icon"
              />
              Sign up with Google
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" >
            Create Account
          </button>

          {/* Error Message */}
          {err && <p className="error-message">{err}</p>}

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
