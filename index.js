const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const animeRoutes = require("./src/routes/animeRoutes");
const episodeRoutes = require("./src/routes/episodeRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*", // hamma domenga ruxsat
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "*",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

// Ensure upload directories exist
const uploadDirs = [
  path.join(__dirname, "uploads"),
  path.join(__dirname, "uploads/images"),
  path.join(__dirname, "uploads/videos"),
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/anime", animeRoutes);
app.use("/api/episodes", episodeRoutes);

// Error handling
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large. Max size is 5GB." });
  }
  if (err.message === "Invalid file type") {
    return res.status(400).json({ error: "Only image or video files allowed" });
  }
  next(err);
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
