const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.baseUrl.includes("auth")) {
      // If route is for user profile (auth/register or auth/profile)
      cb(null, path.join(__dirname, "../../uploads/profilePics"));
    } else if (file.mimetype.startsWith("image")) {
      cb(null, path.join(__dirname, "../../uploads/images"));
    } else if (file.mimetype.startsWith("video")) {
      cb(null, path.join(__dirname, "../../uploads/videos"));
    } else {
      cb(new Error("Invalid file type"));
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExts = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".mp4",
    ".mkv",
    ".mov",
    ".webm",
  ];
  const ext = path.extname(file.originalname).toLowerCase();

  if (
    file.mimetype.startsWith("image") ||
    file.mimetype.startsWith("video") ||
    allowedExts.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"));
  }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
