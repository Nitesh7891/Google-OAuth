import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB=async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB",error);
        throw error;
    }
}