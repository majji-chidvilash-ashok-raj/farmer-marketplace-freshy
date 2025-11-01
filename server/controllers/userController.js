import mongoose from "mongoose";
import User from "../models/user.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid or missing user ID" });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error in getCurrentUser:", error);
        return res.status(500).json({ message: "Server error while fetching current user" });
    }
};
