const multer = require("multer");
const path = require("path");

// Use memory storage to store files in memory as Buffers
const storage = multer.memoryStorage();

// File filter function to restrict uploads to specific file types
function fileFilter(req, file, cb) {
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp"];

  // Extract the file extension
  const fileExtension = path.extname(file.originalname);

  // Check if the file extension is allowed
  if (allowedExtensions.includes(fileExtension.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only .png, .jpg, .jpeg, and .webp are allowed."));
  }
}

// Multer setup
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
});

module.exports = upload;
