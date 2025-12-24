# JARVIS.OS
> **Autonomous Neural Interface for the Next Generation of Vibe-Coding Developers.**

![System Status](https://img.shields.io/badge/System%20Status-Optimal-teal?style=for-the-badge&logo=statuspage)
![Core](https://img.shields.io/badge/Core-v2.4-purple?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**JARVIS.OS** is a modular, AI-powered operating system companion designed to revolutionize the developer workflow. It blends advanced voice control, intelligent task automation, and a futuristic, cinematic web interface to create a seamless "vibe-coding" experience.

---

## 🌌 System Architecture

The system is composed of **6 Interconnected Modules**, operating in harmony:

| Module |Tech Stack | Function |
| :--- | :--- | :--- | 
| **`dev-frontend-ui`** | Next.js, Tailwind, GSAP | The visual cortex. A futuristic dashboard with holographic controls. |
| **`dev-auth-backend`** | Node.js, Express | The gateway. Handles auth, API routing, and AI command simulation. |
| **`dev-ai-llm`** | TypeScript | The brain. Intent recognition and LLM inference engine. |
| **`dev-assistant-core`** | TypeScript | The nervous system. Coordinates multi-agent tasks and permissions. |
| **`dev-voice-system`** | Python | The ears & mouth. Whisper-based STT and neural TTS. |
| **`dev-os-automation`** | Python | The hands. Secure file system and application control. |

---

## ✨ Key Capabilities

- **🗣️ Neural Voice Interface**: Multi-language support (English/Hindi) with wake-word detection.
- **🧠 Contextual Intelligence**: 90%+ accuracy in intent recognition and entity extraction.
- **🛡️ Adaptive Security**: Role-based access control with real-time risk assessment.
- **🎨 Cinematic UI**: Glassmorphism-based design with complex orbital animations (GSAP) and smooth scrolling (Lenis).
- **🔌 Mock Mode**: dedicated development mode to simulate AI responses without consuming API credits.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** 20+
- **Python** 3.8+
- **npm** or **yarn**

### 2. Installation

**Python Environment**
```bash
python -m venv env
# Windows
env\Scripts\activate
# macOS/Linux
source env/bin/activate

pip install -r requirements-all.txt
```

**Node.js Modules**
```bash
# Install dependencies for the frontend and backend
cd apps/dev-frontend-ui && npm install
cd ../dev-auth-backend && npm install
```

### 3. Initialize System

**Step 1: Start the API Gateway (Backend)**
```bash
cd apps/dev-auth-backend
npm run dev
# 📡 Listening on port 3001
```

**Step 2: Launch the Interface (Frontend)**
```bash
cd apps/dev-frontend-ui
npm run dev
# 🚀 Dashboard live at http://localhost:3000
```

---

## 🎮 Mock Mode

The system currently runs in **Mock Mode** by default. This allows you to interact with JARVIS without needing active LLM or complex backend services running.

**Try these commands in the prompt:**
- `"Hello"` → JARVIS introduces himself.
- `"Status"` → Returns system diagnostics.
- `"Open Chrome"` → Simulates application launch.
- `"Open VS Code"` → Simulates IDE launch.

---

## 📂 Project Structure

```
JARVIS-OS/
├── apps/
│   ├── dev-frontend-ui/       # Next.js Dashboard
│   ├── dev-auth-backend/      # API Gateway & Mock Server
│   ├── dev-ai-llm/            # AI Logic (Logic Only)
│   ├── dev-assistant-core/    # Task Orchestration (Logic Only)
│   ├── dev-voice-system/      # Python Voice Service
│   └── dev-os-automation/     # Python Automation Service
├── env/                       # Python Virtual Environment
├── requirements-all.txt       # Python Dependencies
└── README.md                  # System Documentation
```

---

## 🛠️ Tech Stack Details

**Frontend**
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS (Cyberpunk Theme)
- **Animations**: GSAP (GreenSock), Framer Motion
- **Icons**: Lucide React

**Backend**
- **Runtime**: Node.js
- **Server**: Express
- **Security**: JWT, CORS

---

> *"Just a rather very intelligent system."*
