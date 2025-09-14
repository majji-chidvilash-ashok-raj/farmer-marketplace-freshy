import React, { useState } from "react";
import "./signin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "./../../App";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${serverURL}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      console.log("✅ Login Success:", response.data);
      // Example: redirect to dashboard
      // navigate("/dashboard");
    } catch (error) {
      console.error("❌ Login Failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="signup-background">
      <div className="signup-container">
        <h1>FRESHY</h1>
        <p className="subtext">Login to buy fresh produce</p>

        <form onSubmit={handleSignIn}>
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

          {/* Forgot Password link */}
          <p
            className="forgot-password"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>

          {/* Sign in button */}
          <button type="submit">Sign In</button>

          {/* Google Sign in */}
          <div className="form-group">
            <button type="button" className="google-signup-btn">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google icon"
              />
              Sign in with Google
            </button>
          </div>

          {/* Sign up link */}
          <p className="login-link" onClick={() => navigate("/signup")}>
            Don’t have an account? <a>Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
