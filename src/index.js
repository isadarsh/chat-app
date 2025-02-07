import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js"
import connectDB from "./lib/db.js"; 
import cookieParser from "cookie-parser"

dotenv.config();

const app = express();

app.use(express.json()); // middleware to parse json data
app.use(cookieParser()); //this package helps parse cookies (like req.cookies.jwt)

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 5001;

// Connect to the database
connectDB();

app.listen(PORT, () => {
    console.log("server is running on port: " + PORT);
});