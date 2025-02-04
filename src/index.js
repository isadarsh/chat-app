import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectDB from "./lib.db.js"; 

dotenv.config();

const app = express();

app.use(express.json()); // middleware to parse json data

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5001;

// Connect to the database
connectDB();

app.listen(PORT, () => {
    console.log("server is running on port: " + PORT);
});