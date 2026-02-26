/*
Run this in terminal:
cd backend
node server.js
*/

const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// CORS configuration: allow all origins for development
// In production, configure specific allowed origins in .env
app.use(cors());

app.use(express.json());

// expose the root user.json to clients (frontend can fetch it)
app.get('/user.json', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'user.json'));
});

// Serve static uploaded files
app.use(
  '/uploads',
  express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads'))
);

// Routes
const fileRoutes = require('./routes/files');
app.use('/api/files', fileRoutes);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ File-share API running at http://0.0.0.0:${PORT}`);
});