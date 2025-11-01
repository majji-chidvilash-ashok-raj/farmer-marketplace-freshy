import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import SignIn from "./pages/signin/SignIn";
import SignUp from "./pages/signup/SignUp";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import Home from "./pages/home/home"; // ✅ Corrected capitalization
import useGetCurrentUser from "./hooks/useGetCurrentUser";

export const serverURL = "http://localhost:4000";

const App = () => {
  useGetCurrentUser();
  const { userData } = useSelector((state) => state.user);

  return (
    <Routes>
      {/* Signup */}
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/" />}
      />

      {/* Signin */}
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to="/" />}
      />

      {/* Forgot Password */}
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Home / Root */}
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
};

export default App;
