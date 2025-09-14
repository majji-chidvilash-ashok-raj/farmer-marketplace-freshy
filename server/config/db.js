import mongoose from "mongoose"

const connectDB = async ()=> {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB conneccted")
    } catch (error) {
        console.log("DB error")
    }
}

export default connectDB;