# File Transfer App

A simple Node.js/Express file upload and download service with a clean HTML frontend.

## Features

- 📤 **File Upload**: Upload files via web UI
- 📋 **File Listing**: View all uploaded files with download links
- 🔗 **CORS Enabled**: Works from any origin
- 🚀 **Lightweight**: Minimal dependencies, easy to modify
- ⚙️ **Configurable**: Customizable port, directory, and limits

## Quick Start

### Prerequisites

- Node.js (v14 or later)
- npm (comes with Node.js)

### Setup

**Backend (Terminal 1):**
```bash
cd backend
npm install
npm run dev        # Starts on http://localhost:8000
```

**Frontend (Terminal 2):**
```bash
cd frontend
npx serve -l 3000 --single   # Starts on http://localhost:3000 and http://{your-ip}:3000
```

**Then:** Open `http://localhost:3000` or `http://{your-ip}:3000` in your browser.

## Project Structure

```
.
├── backend/
│   ├── .env                  # Configuration
│   ├── package.json
│   ├── server.js             # Express server
│   ├── routes/files.js       # File handling routes
│   └── uploads/              # Uploaded files (created at runtime)
├── frontend/
│   └── index.html            # Web UI
├── .gitignore
└── README.md
```

## Configuration

Edit `backend/.env`:

```env
PORT=8000                          # Server port
UPLOAD_DIR=uploads                 # File storage directory
MAX_FILE_SIZE=5242880              # Max file size (bytes, 5MB default)
ALLOWED_ORIGINS=http://localhost:3000  # CORS allowed origins
```

## How It Works

### Backend
- Express.js server with CORS for cross-origin requests
- Multer middleware handles file uploads
- Files stored in `backend/uploads/`
- API endpoints:
  - `POST /api/files/upload` - Upload file
  - `GET /api/files` - List files
  - `GET /uploads/<filename>` - Download file

### Frontend
- Plain HTML/CSS/JavaScript (no build tools)
- Fetches configuration from backend
- Handles multipart file uploads
- Lists files with direct download links

## API Endpoints

### POST /api/files/upload
Upload a file

```bash
curl -X POST -F "file=@myfile.txt" http://localhost:8000/api/files/upload
```

Response:
```json
{"message": "File uploaded successfully", "filename": "1708946123456-myfile.txt"}
```

### GET /api/files
List all uploaded files

```bash
curl http://localhost:8000/api/files
```

Response:
```json
["1708946123456-file1.txt", "1708946124567-file2.pdf"]
```

### GET /uploads/<filename>
Download a file directly via the browser or curl

## npm Scripts

```bash
cd backend

npm install     # Install dependencies
npm run dev     # Start with nodemon (auto-restart)
npm start       # Start normally
```

## Troubleshooting

### Upload fails  
- Check backend is running: `http://localhost:8000`
- Open browser console (F12) for error details
- Verify `ALLOWED_ORIGINS` includes your frontend URL
- Check file size against `MAX_FILE_SIZE` limit

### Files don't appear
- Check backend terminal for upload messages
- Verify `backend/uploads/` directory has files
- Refresh the browser page
- Check browser console for errors

### Port already in use
- Change `PORT` in `backend/.env`
- Or kill the process using that port

### Module not found
- Run `npm install` in `backend/` directory

## Development

- **Backend**: Use `npm run dev` for auto-restart on code changes
- **Frontend**: Edit `frontend/index.html` and refresh browser
- **Debugging**: Press F12 in browser to open DevTools console

## Notes

- **No database**: Files stored on filesystem only
- **No authentication**: Anyone with access can upload/download
- **File naming**: Timestamps prevent filename conflicts
- **Git ignored**: `backend/node_modules/`, `backend/.env`, `backend/uploads/`
- **CORS**: Currently allows all origins (configure for production)
- **File limits**: Default 5MB max; adjust `MAX_FILE_SIZE` in `.env`

## 📜 License

This project is protected under a custom license.

See the [LICENSE](LICENSE) file for full details.
