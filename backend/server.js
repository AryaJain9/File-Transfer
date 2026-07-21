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

/*
 CORS policy
 -----------
 If ALLOWED_ORIGINS is set in .env (comma separated), only those origins are
 accepted -- use this when exposing the server beyond a trusted network.

 If it isn't set, any origin on a private/LAN address is accepted. That means
 the frontend works from localhost, from your laptop's LAN IP, or from a phone
 on the same wifi, without hardcoding an address that changes. Public websites
 are still refused, so a random site you visit can't reach into this server.
*/
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const isPrivateOrigin = (origin) => {
  try {
    const { hostname } = new URL(origin);
    return (
      hostname === 'localhost' ||
      hostname === '[::1]' ||
      /^127\./.test(hostname) ||                     // loopback
      /^10\./.test(hostname) ||                      // 10.0.0.0/8
      /^192\.168\./.test(hostname) ||                // 192.168.0.0/16
      /^172\.(1[6-9]|2\d|3[01])\./.test(hostname) || // 172.16.0.0/12
      /^169\.254\./.test(hostname)                   // link-local
    );
  } catch {
    return false; // unparseable origin -> reject
  }
};

if (allowedOrigins.length) {
  console.log('🔒 CORS restricted to:', allowedOrigins.join(', '));
} else {
  console.log('🌐 CORS: allowing any local network origin (set ALLOWED_ORIGINS in .env to restrict)');
}

app.use(
  cors({
    origin: (origin, cb) => {
      // No Origin header: curl, same-origin requests, direct browser hits.
      if (!origin) return cb(null, true);

      if (allowedOrigins.length) return cb(null, allowedOrigins.includes(origin));

      const ok = isPrivateOrigin(origin);
      if (!ok) console.warn('⛔ Blocked cross-origin request from:', origin);
      return cb(null, ok);
    }
  })
);

app.use(express.json());

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