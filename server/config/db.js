import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

const connectDB = async ()=> {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB conneccted")
    } catch (error) {
        console.log("DB error")
    }
}

export default connectDB;