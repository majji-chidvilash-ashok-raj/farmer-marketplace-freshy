import React, { useState } from "react";
import "./signin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "./../../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../firebase";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle normal email/password login
  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${serverURL}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      console.log("Signin Success:", response.data);
      navigate("/dashboard"); // Redirect after login
    } catch (error) {
      setErr(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const { data } = await axios.post(
        `${serverURL}/api/auth/googleauth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          mobile: "", // optional: prompt user if needed
          role: "buyer", // default role
        },
        { withCredentials: true }
      );

      console.log("Google Signin Success:", data);
      navigate("/dashboard"); // Redirect after Google login
    } catch (error) {
      setErr(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-background">
      <div className="signin-container">
        <h1>FRESHY</h1>
        <p className="subtext">Login to buy fresh produce</p>

        <form onSubmit={handleSignIn}>
          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Login"}
          </button>

          {/* Error Message */}
          {err && <p className="error-message">{err}</p>}

          {/* Google Sign in */}
          <div className="form-group">
            <button
              type="button"
              className="google-signin-btn"
              onClick={handleGoogleAuth}
              disabled={loading}
            >
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
