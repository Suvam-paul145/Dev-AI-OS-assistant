# 🚀 Dev AI OS - Setup Guide

This guide details how to run the **Dev AI OS** in real-time with all components connected.

## Architecture Overview
- **Backend (Node.js)**: Port 3001. Handles API & Auth. Connected to MongoDB.
- **OS Automation (Python)**: Port 8000. Handles File/App operations.
- **Voice System (Python)**: Standalone. Processes mic input.
- **Frontend (Next.js)**: Port 3000. Visual Interface.

---

## 1. Prerequisites

- **Node.js** (v18+)
- **Python** (v3.10+)
- **MongoDB** (Local or Atlas URI)
- **Google Cloud Credentials** (Client ID & Secret for OAuth)

---

## 2. Integration Steps

You will need **4 separate terminal windows** to run the full stack.

### Terminal 1: OS Automation Service
This bridge allows the backend to control your PC.
```bash
cd apps/dev-os-automation
# Activate Python Env
..\..\env\Scripts\activate
# Start Server
python src/server.py
# ⚡ Listening on http://0.0.0.0:8000
```

### Terminal 2: Main Backend API
The central brain linking everything.
```bash
cd apps/dev-auth-backend
# Ensure .env is configured (see .env.example)
npm run dev
# 🚀 Server listening on port 3001
# ✅ MongoDB Connected
```

### Terminal 3: Frontend Dashboard
The visual interface.
```bash
cd apps/dev-frontend-ui
npm run dev
# 🚀 Dashboard live at http://localhost:3000
```

### Terminal 4: Voice Listener (Optional)
If you want voice interaction.
```bash
cd apps/dev-voice-system
..\..\env\Scripts\activate
python src/main.py
```

---

## 3. Configuration

### Backend Environment (`apps/dev-auth-backend/.env`)
Ensure you have a `.env` file with the following:
```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
JWT_ACCESS_SECRET=your_jwt_secret
```

---

## 4. Verification
1.  Open `http://localhost:3000`.
2.  Click **"Initialize Core"** to log in via Google.
3.  Once on the dashboard, type `open notepad` in the chat.
4.  **Success**: Notepad should open on your machine, and the command should be logged in MongoDB.
