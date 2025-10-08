const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) cb(null, "uploads/images");
    else if (file.mimetype.startsWith("video")) cb(null, "uploads/videos");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) cb(null, true);
  else cb(new Error("Invalid file type"));
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
