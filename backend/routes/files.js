const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: process.env.MAX_FILE_SIZE || 5242880 } // 5MB default
});

// Upload file endpoint
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  console.log('📁 Uploaded:', req.file.filename);
  res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

// List files endpoint
router.get('/', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ message: 'Failed to read files' });
    res.json(files);
  });
});

module.exports = router;