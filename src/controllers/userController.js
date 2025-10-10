const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // profilePic upload (if file was sent)
    const profilePicPath = req.file
      ? `/uploads/profilePics/${req.file.filename}`
      : username.charAt(0).toUpperCase();

    const user = new User({
      username,
      email,
      password: hashedPassword,
      profilePic: profilePicPath,
      isAdmin: false,
    });

    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET USER PROFILE
exports.getUserProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE USER PROFILE
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { username, email, password } = req.body;

    if (username) user.username = username;
    if (email) user.email = email;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // If profile picture is updated
    if (req.file) {
      // Delete old pic if it's a file (not just a letter)
      if (user.profilePic && user.profilePic.startsWith("/uploads/")) {
        const oldPicPath = path.join(__dirname, "../..", user.profilePic);
        fs.unlink(oldPicPath, (err) => {
          if (err) console.log("Failed to delete old pic:", err);
        });
      }

      user.profilePic = `/uploads/profilePics/${req.file.filename}`;
    }

    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete profile picture if it exists
    if (user.profilePic && user.profilePic.startsWith("/uploads/")) {
      const picPath = path.join(__dirname, "../..", user.profilePic);
      fs.unlink(picPath, (err) => {
        if (err) console.log("Error deleting profile pic:", err);
      });
    }

    await user.deleteOne();
    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL USERS (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET USER BY ID (Admin or self)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
