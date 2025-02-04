import { generateToken } from "../lib/util.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { email, name, password } = req.body; //app.use-json middleware (read more)
  try {
    if (!email || !name || !password) {
      res.send.status(200).json({ message:"All feilds are required"});
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email: email,
      name: name,
      password: hashedPassword,
    });

    if (newUser) {
      // gnrate jwt
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,

      })
    } else {
      res.status(400).json({ message: "Failed to create user" });
    }

  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({
      message: "Internal server error"
    });
  }
}

export const login = async (req, res) => {
  //todo: already logged in check
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
    });
    
  } catch (error) {
    console.log("error in login controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  //todo: it isn't verified logout, like one could do non existent account
  try {
    res.cookie("jwt", "", { maxage: 0 });
    res.status(200).json({ message: "Logged out successfuly" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = (req, res) => {
  return res.status(200).json({message: "Profile updated successfuly"})
}