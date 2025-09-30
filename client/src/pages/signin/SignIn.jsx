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

  // Handle normal email/password login
  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${serverURL}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      setErr("");
      console.log("Signin Success:", response.data);

      // Navigate after successful login
      navigate("/dashboard"); // change route as needed
    } catch (error) {
      setErr(error.response?.data?.message || error.message);
    }
  };

  // Handle Google login
  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const { data } = await axios.post(
        `${serverURL}/api/auth/googleauth`,
        { email: result.user.email },
        { withCredentials: true }
      );

      console.log("Google Signin Success:", data);

      // Navigate after successful google login
      navigate("/dashboard"); // change route as needed
    } catch (error) {
      console.log(error);
      setErr(error.response?.data?.message || error.message);
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

          {/* Error Message */}
          {err && <p className="error-message">{err}</p>}

          {/* Google Sign in */}
          <div className="form-group">
            <button
              type="button"
              className="google-signin-btn"
              onClick={handleGoogleAuth}
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
