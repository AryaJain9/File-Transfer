# File Transfer App

A simple Node.js/Express file upload and download service with a clean HTML frontend. Built for moving files between machines on a local network — laptop to phone, desktop to laptop — without a cloud service in the middle.

## Features

- 📤 **File Upload**: Upload files via web UI
- 📋 **File Listing**: View all uploaded files with download links
- 🌐 **LAN Ready**: Works across devices on the same network out of the box
- 🔗 **Configurable CORS**: Lock to specific origins via `.env`
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
│   ├── index.html            # Web UI
│   └── user.json             # Optional: point frontend at a remote backend
├── .gitignore
└── README.md
```

## Configuration

Edit `backend/.env`:

```env
PORT=8000                          # Server port
UPLOAD_DIR=uploads                 # File storage directory
MAX_FILE_SIZE=5242880              # Max file size (bytes, 5MB default)

# Optional. Leave unset to accept any local-network origin (localhost, LAN IPs).
# Set it to lock the API to specific frontends, comma separated:
# ALLOWED_ORIGINS=http://localhost:3000,http://192.168.1.20:3000
```

### Pointing the frontend at another machine

Edit `frontend/user.json` to reach a backend that isn't on localhost:

```json
{ "ip": "192.168.1.20" }
```

Port 8000 is assumed if you omit it. `"192.168.1.20:9000"` and `"http://192.168.1.20:9000"` also work. Leave `ip` empty to use localhost.

To use it from a phone: set `ip` to the host machine's LAN address, serve the frontend, then open `http://{host-ip}:3000` on the phone. Both devices must be on the same network, and your firewall may prompt to allow Node the first time.

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
- Reads `frontend/user.json` to optionally target a remote backend
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
- Check file size against `MAX_FILE_SIZE` limit
- If you set `ALLOWED_ORIGINS`, it must list the exact origin shown in the browser address bar (scheme, host, and port). The backend prints its CORS mode on startup.

### "No 'Access-Control-Allow-Origin' header" in the console
The backend rejected your frontend's origin. Check the backend startup line:

- `🔒 CORS restricted to: ...` — `ALLOWED_ORIGINS` is set and your origin isn't on the list. Add it, or comment the variable out to allow any LAN origin.
- `🌐 CORS: allowing any local network origin` — your origin isn't a private address, which is unusual for local use.

`.env` is read once at startup, so restart the server after editing it.

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
- **File naming**: Timestamps prevent filename conflicts
- **Git ignored**: `backend/node_modules/`, `backend/.env`, `backend/uploads/`
- **CORS**: Restricted to `ALLOWED_ORIGINS` when set in `.env`; otherwise any local network origin is allowed
- **File limits**: Default 5MB max; adjust `MAX_FILE_SIZE` in `.env`

## ⚠️ Security

This is a LAN utility, not a public file host. Known limitations, by design:

- **No authentication.** Anyone who can reach the server can upload and download.
- **No file type validation.** Uploads are stored as sent; only the 5MB size cap applies.
- **CORS is not access control.** It stops other websites from calling this API through your browser. It does not stop someone requesting the URL directly.

Run it on a network you trust. Before exposing it anywhere else, add authentication, set `ALLOWED_ORIGINS`, and validate uploads.

## 📜 License

This project is protected under a custom license.

See the [LICENSE](LICENSE) file for full details.