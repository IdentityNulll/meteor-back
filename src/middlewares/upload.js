const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image"))
      cb(null, path.join(__dirname, "../../uploads/images"));
    else if (file.mimetype.startsWith("video"))
      cb(null, path.join(__dirname, "../../uploads/videos"));
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
