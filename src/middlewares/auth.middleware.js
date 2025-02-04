import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({message: "Unauthorized - no token found"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); //should be await?
        if (!decoded) {
            return res.status(401).json({message: "Unauthorized - invalid token"})
        }

        const user = User.findById(decoded.userId).select("password"); //deselect password //we had setup {userId} in "lib.util.js"
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
