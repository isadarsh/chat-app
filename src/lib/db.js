import mongoose from "mongoose";

const connectDB=async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MONGODB is connected: ${conn.connection.host}`);
    } catch (err) {
        console.log(`MONGODB connection error: ${err.message}`);
        process.exit(1);
    }
}

export default connectDB