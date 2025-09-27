import express from "express";
import { resetPassword, sendOtp, signIn, signOut, signUp, verifyOtp, googleAuth} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signup",signUp);
authRouter.post("/signin",signIn);
authRouter.get("/signout",signOut);
authRouter.post("/sendotp",sendOtp);
authRouter.post("/verifyotp",verifyOtp);
authRouter.post("/resetpassword",resetPassword);
authRouter.post("/googleauth",googleAuth);


export default authRouter;
