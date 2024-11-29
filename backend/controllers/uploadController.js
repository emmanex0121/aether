import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { apiResponseCode } from "../helper.js";

// Get the current directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the parent directory
const parentDir = path.join(__dirname, "..");

// Ensure uploads folder exists
const uploadDir = path.join(parentDir, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Create the uploads directory if it doesn't exist
}

// Set up storage and folder for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    cb(null, uploadPath); // Folder for uploads
  },
  filename: (req, file, cb) => {
    // Generate a unique file name using timestamp and random number
    const uniqueSuffix =
      "upload-" + Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Set the new file name as uniqueSuffix and the original file extension
    const extension = path.extname(file.originalname); // Get the file extension
    cb(null, `${uniqueSuffix}${extension}`); // Store with the unique name and extension
  },
});

// Configure multer
const upload = multer({ storage });

// Middleware for handling multiple file uploads
const uploadMiddleware = upload.array("images", 10); // Accept up to 10 files

// Upload handler for multiple images
const uploadHandler = (req, res) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.log("line 26 debug", err.message);
      return res.status(500).json({
        responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
        responseMessage: "Internal Server Error",
        data: null,
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: "No files uploaded",
        data: null,
      });
    }

    // Construct file URLs for all uploaded files
    const fileUrls = req.files.map(
      (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
    );

    res.status(200).json({
      responseCode: apiResponseCode.SUCCESS,
      responseMessage: "Successfully Uploaded Image",
      data: fileUrls,
    });
  });
};

export { uploadHandler };
