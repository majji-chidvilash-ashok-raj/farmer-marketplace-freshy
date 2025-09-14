import { sendOtpMail } from "../middlewares/mail.js";
import  Token  from "../middlewares/verifyToken.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";


export const signUp =async (req,res) => {
    try {
       const {fullName,email,password,mobile} = req.body; 
       let user = await User.findOne({email});
       if(user){
        return res.status(400).json({message:"User already exists"});
       }

       if(password.length<6){
         return res.status(400).json({message:"Password must be atleast 6 characters"});
       }

       if(mobile.length<10){
         return res.status(400).json({message:"mobile number must be atleast 10 characters"});
       }

       const hashedPassword = await bcrypt.hash(password,10);
       user = await User.create({
        fullName,
        email,
        password:hashedPassword,
        mobile
       })

       const token = await Token(user._id);
       res.cookie("token",token,{
        secure:false,
        sameSite:"strict",
        maxAge:7*24*60*60*1000,
        httpOnly:true
       })

       return res.status(201).json({message:"User created successfully"})




    } catch (error) {
        return res.status(500).json({message:"server error"});
    }
}

export const signIn =async (req,res) => {
    try {
       const {email,password} = req.body; 
       const user = await User.findOne({email});
       if(!user){
        return res.status(400).json({message:"User does not exists"});
       }



     
       const isMatch = await bcrypt.compare(password,user.password);
       if(!isMatch){
        return res.status(400).json({message:"Invalid credentials"});
       }

       const token = await Token(user._id);
       res.cookie("token",token,{
        secure:false,
        sameSite:"strict",
        maxAge:7*24*60*60*1000,
        httpOnly:true
       })

       return res.status(200).json({message:"signIn successfull"})




    } catch (error) {
        return res.status(500).json({message:"server error"});
    }
}

export const signOut = async(req,res)=>{
    try {
        res.clearCookie("token");
        return res.status(200).json({message:"Signout successfull"})
    } catch (error) {
        return res.status(500).json({message:"server error"});
    }
}

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
    console.error("Send OTP error:", error); // 👈 full error log
    return res.status(500).json({ message: "server error", error: error.message });
  }
};



export const verifyOtp = async(req,res) =>{
    try {
        const {email,otp}= req.body;
        const user = await User.findOne({email});
        if(!user || user.resetOtp!=otp || user.otpExpires<Date.now()){
            return res.status(400).json({message:"Invalid OTP"})
        }
        user.isOtpVerified=true;
        user.resetOtp=undefined;
        user.otpExpires=undefined;
        await user.save();
        return res.status(200).json({message:"OTP verified successfully"})
    } catch (error) {
        return res.status(500).json({message:"server error"});
    }
}


export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "OTP verification required" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.isOtpVerified = false;   // reset BEFORE saving
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "server error" });
  }
};
