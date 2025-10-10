const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers,
  getUserById,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

// Register (with optional profile pic)
router.post("/register", upload.single("profilePic"), registerUser);

// Login
router.post("/login", loginUser);

// Get profile
router.get("/me", protect, getUserProfile);

// Update profile (username, email, password, profile pic)
router.put("/update", protect, upload.single("profilePic"), updateUserProfile);

// Delete account
router.delete("/delete", protect, deleteUser);
// Get all users
router.get("/all", protect, getAllUsers);

// Get single user by ID
router.get("/:id", protect, getUserById);

module.exports = router;
