# Saheli AI

**A zero-trace, real-time safety and legal-empowerment ecosystem for women facing domestic duress — combining acoustic telemetry, multilingual voice-to-legal drafting, and hyper-local economic support across India.**

Designed to dismantle the 86% domestic violence reporting deficit in India (NFHS-5 data). Full-stack, privacy-first, and aligned with BNSS 2024 e-FIR digital standards.

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Core Features](#core-features)
- [System Architecture](#system-architecture)
- [Application Flow](#application-flow)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Setup Instructions](#local-setup-instructions)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database & Storage Architecture](#database--storage-architecture)
- [Known Behavior: Cold Starts & Free-Tier Hosting](#known-behavior-cold-starts--free-tier-hosting)
- [Engineering Decisions](#engineering-decisions)
- [Challenges We Ran Into](#challenges-we-ran-into)
- [Future Roadmap](#future-roadmap)
- [Open-Source Attribution](#open-source-attribution)

---

## Overview

Saheli AI is a mobile-first, web-based digital ecosystem designed to lower the barriers to legal recourse, immediate physical safety, and long-term financial independence for women experiencing domestic violence in India.

The platform recognizes that traditional emergency tools fail because abusers monitor physical devices, victims lack legal jargon to lodge police complaints, and financial dependence traps survivors in abusive households. Saheli AI addresses these systemic bottlenecks by combining zero-latency acoustic telemetry via WebSockets, AI-powered multilingual speech-to-legal drafting (converting natural spoken dialects into court-ready FIR/NCW documentation), and a dynamic national network connecting women to verified self-help group (SHG) livelihood mentors.

## Problem Statement

According to the National Family Health Survey (NFHS-5) and National Crime Records Bureau (NCRB) data:

1. **The Reporting Deficit:** 86% of women who experience domestic violence in India never report it or seek institutional help due to fear, social stigma, and institutional apathy at police desks.
2. **Economic Dependency Trap:** Women frequently refrain from filing complaints because removing an abusive spouse removes the primary income source for their children.
3. **Legal Drafting & Dialect Barriers:** Victims who attempt to report are often turned away because their verbal complaints lack specific legal references (such as IPC Section 498A or PWDVA codes) or are delivered in regional dialects that local precinct desks dismiss.
4. **Device Monitoring:** Abusers frequently inspect wives' phones. Installing a dedicated "domestic violence app" from an app store creates immediate safety risks.

## Core Features

### 1. National Impact Map & Command Center (`MyStory.jsx`)
An interactive SVG visualization covering all 28 States and 8 Union Territories in India. Evaluators and users can select any state to inspect:
- State-specific safety indices and crime reporting metrics.
- Regional strengths and cultural context.
- Verified local livelihood partners (e.g., SEWA, Kudumbashree, MAVIM, Snehalaya).
- Pure Tailwind CSS analytics visualization detailing the NFHS-5 reporting deficit and 5-month post-intervention livelihood stability trajectories.
- A 10-point core justification grid grounding the platform's architecture in current legal and sociological realities.

### 2. SafeMode (Continuous Acoustic Telemetry & SOS)
A discreet, background monitoring engine for crisis situations.
- Establishes a persistent WebSocket connection (`/ws/safemode/{session_id}`) streaming binary audio chunks to the backend.
- Upon threat verification or manual panic trigger, the engine packages real-time GPS coordinates and incident packets, dispatching them to trusted emergency contact arrays via WhatsApp API integrations.

### 3. BolDo Scribe (Voice-to-Court-Ready Legal Draft)
A multilingual voice interface allowing users to dictate raw grievances in Hindi, Gujarati, Marathi, or English.
- Streams audio bytes to a FastAPI backend routed to the Groq Whisper-large-v3 model for low-latency speech-to-text conversion.
- Applies LLM prompt engineering to parse natural emotion into a structured, court-ready document containing relevant legal citations (e.g., IPC 498A, Protection of Women from Domestic Violence Act).
- Generates a client-side downloadable PDF ready for immediate submission to Station House Officers (SHOs), e-FIR portals under BNSS 2024, or the National Commission for Women (NCW) portal.

### 4. Pehchaan (Hyper-Local Mutual-Aid Hub)
A community dashboard designed to break pluralistic ignorance and geographical isolation. Features three distinct feeds:
- **Survival Stories:** Geotagged quotes and peer insights from survivors who have successfully navigated the legal/economic system.
- **Local Networks:** A directory of vetted neighborhood helpers, pro-bono lawyers, and medical volunteers.
- **Milestone Broadcasts:** A real-time, anonymous community feed where users post and celebrate steps toward independence.

### 5. HaqFinder (AI Legal Assistant)
A conversational interface specialized in Indian family law and women's rights. Executes `POST` calls to `/api/haqfinder/chat` with structured context history arrays, providing low-latency, plain-language guidance on legal rights, shelter access, and child custody laws.

### 6. Zero-Trace Architecture & One-Click Panic Wipe
Operates entirely within a standard mobile web browser without requiring app installation. Features a global **One-Click Panic Wipe** button that flushes `localStorage`, clears session caches, and immediately redirects the browser to an innocuous destination to protect the user if an abuser approaches.

---

## System Architecture

```mermaid
flowchart LR
    subgraph Client["Frontend Layer (Vercel)"]
        UI["React + Vite + Tailwind CSS"]
        Wipe["One-Click Panic Wipe / LocalStorage Sanitizer"]
        PDF["Client-Side PDF Generator"]
    end

    subgraph Backend["Service Layer (Render)"]
        API["FastAPI + Uvicorn"]
        WS["WebSocket Server (/ws/safemode)"]
        Router["API Router (/routers)"]
        Clean["Async Audio Cleanup (os.remove)"]
    end

    subgraph External["AI & Storage Layer"]
        Groq["Groq API (Whisper-large-v3)"]
        LLM["Legal Formatting LLM Engine"]
        DB[("PostgreSQL Database")]
        WhatsApp["WhatsApp Telemetry API"]
    end

    UI -- "HTTPS / REST Requests" --> API
    UI <--> WS
    API --> Router
    Router -- "Raw WebM Bytes" --> Groq
    Groq -- "Multilingual Transcript" --> LLM
    LLM -- "Structured Legal JSON" --> API
    API --> Clean
    API -- "Persist Milestones & Directory" --> DB
    WS -- "Trigger Incident Packet" --> WhatsApp
    API -- "Return Court-Ready Payload" --> PDF
```

**Key Request Pipeline (BolDo Scribe):**
1. Frontend captures audio via browser MediaRecorder in WebM/Opus format.
2. WebM bytes are posted to `/api/boldo/transcribe` wrapped in a `BytesIO` container.
3. Backend forwards bytes to Groq Whisper-large-v3 for near-instant transcription.
4. Transcribed text is processed by the legal LLM prompt layer to inject appropriate statutory sections (IPC 498A, BNSS 2024 e-FIR format).
5. Structured JSON returns to the client for PDF rendering; the server executes `os.remove()` in a `finally` block to delete temporary server-side audio files immediately.

## Application Flow

```mermaid
flowchart TD
    A["User Lands on Saheli AI Web Platform"] --> B{"Choose Action"}

    B -- "Explore Impact & Livelihood" --> C["MyStory / National Impact Map"]
    C --> D["Select State / UT (28 States + 8 UTs)"]
    D --> E["Inspect Local Metrics & Vetted Livelihood Partners (SEWA, Kudumbashree, etc.)"]

    B -- "Immediate Crisis / SOS" --> F["SafeMode"]
    F --> G["Initiate Background Acoustic Telemetry via WebSocket"]
    G --> H{"Threat Detected or Manual Override?"}
    H -- "Yes" --> I["Dispatch GPS Coordinates & Incident Packet via WhatsApp API"]

    B -- "Voice Legal Drafting" --> J["BolDo Scribe"]
    J --> K["Record Natural Speech in Hindi / Gujarati / Marathi / English"]
    K --> L["Backend Transcribes via Groq Whisper-large-v3"]
    L --> M["LLM Formats Narrative into IPC 498A / PWDVA Legal Draft"]
    M --> N["Download Court-Ready PDF / Copy for BNSS e-FIR Portal"]

    B -- "Legal Consultation" --> O["HaqFinder AI Chat"]
    O --> P["Ask Plain-Language Legal Questions"]
    P --> Q["Receive Context-Aware Guidance on Rights & Shelter Access"]

    B -- "Community Network" --> R["Pehchaan Hub"]
    R --> S["Browse Geotagged Stories, Helper Directory, & Post Milestones"]

    E & N & Q & S --> T["Global Safety Gate"]
    T -- "Click Panic Wipe" --> U["Flush LocalStorage, Sanitize Session, & Redirect Browser"]
```

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React.js (bootstrapped with Vite) |
| **Styling & Design** | Tailwind CSS |
| **Icons & Assets** | Lucide React |
| **Backend Framework** | Python — FastAPI, served via Uvicorn |
| **Real-Time Communications** | Native WebSockets (`/ws/safemode`) |
| **Speech-to-Text (STT)** | Groq API (`whisper-large-v3`) |
| **LLM / Legal Structuring** | Groq / Llama-3 / Gemini APIs |
| **Database** | PostgreSQL |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render (Free Tier) |
| **Routing & SPA Config** | `vercel.json` rewrite routing |

## Project Structure

```text
saheli-workspace/
├── backend/
│   ├── app/
│   │   ├── core/                  # Shared utilities, settings, CORS config
│   │   ├── routers/               # Modularized FastAPI routers (safemode, boldo, pehchaan)
│   │   └── models/                # Pydantic schemas and request models
│   ├── temp_audio/                # Volatile directory for transient audio buffer
│   ├── main.py                    # FastAPI application entrypoint & WebSocket handlers
│   ├── requirements.txt           # Python backend dependencies
│   └── .env                       # Backend environment variables
├── frontend/
│   ├── public/                    # Static vector graphics and assets
│   ├── src/
│   │   ├── assets/                # Visual media assets
│   │   ├── components/            # Reusable UI components (Navbar, AudioRecorder)
│   │   ├── context/                # LanguageContext for multilingual state
│   │   ├── pages/                 # Core page modules
│   │   │   ├── Boldo.jsx          # Voice-to-legal draft interface
│   │   │   ├── HaqFinder.jsx      # AI legal assistant chat
│   │   │   ├── Home.jsx           # Landing overview
│   │   │   ├── MyStory.jsx        # National Impact Map & Analytics
│   │   │   ├── Pehchaan.jsx       # Hyper-local mutual-aid hub
│   │   │   └── SafeMode.jsx       # Real-time WebSocket acoustic telemetry
│   │   ├── App.jsx                # Root application layout & client routing
│   │   └── main.jsx               # React entrypoint
│   ├── index.html
│   ├── package.json
│   ├── vercel.json                # Single-page application route rewrite configuration
│   └── vite.config.js
└── README.md
```

## Local Setup Instructions

### Prerequisites
- Node.js (v18+) and npm
- Python 3.10+
- A valid Groq API Key (for Whisper-large-v3 speech-to-text processing)
- A PostgreSQL connection string (optional for local mock run)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd saheli-workspace
```

### 2. Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Create a .env file (see Environment Variables section below)
cp .env.example .env          # or create backend/.env manually

# Start the FastAPI development server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
# Open a new terminal instance and navigate to frontend
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

## Environment Variables

**Backend (`backend/.env`)**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/sahelidb
GROQ_API_KEY=your_groq_api_key_here
CORS_ORIGINS=http://localhost:5173,https://saheli-ai.vercel.app
PORT=8000
CRON_SECRET_TOKEN=your_optional_internal_token
```

**Frontend (`frontend/.env`)**
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## API Reference

| Endpoint | Method | Type | Description |
| --- | --- | --- | --- |
| `/health` | `GET` | REST | Health check endpoint used by external keep-alive cron jobs to prevent Render sleep cycles. |
| `/ws/safemode/{session_id}` | `WS` | WebSocket | Persistent WebSocket connection for streaming binary audio telemetry chunks during crisis mode. |
| `/api/boldo/transcribe` | `POST` | REST | Accepts WebM/Opus audio payload, returns transcribed regional speech and legal LLM formatting. |
| `/api/pehchaan/milestones` | `GET` / `POST` | REST | Retrieves or submits community milestones and geotagged survival stories. |
| `/api/haqfinder/chat` | `POST` | REST | Accepts user queries and conversation history, returning context-aware guidance on Indian family law. |

## Database & Storage Architecture

- **PostgreSQL Layer:** Manages persistent records for community milestone posts, verified legal/medical helper directories, and regional NGO listings.
- **Zero Audio Retention Policy:** Temporary `.webm` files created during Groq transcription processing in `backend/temp_audio/` are written to disk ephemerally. A `finally` block executes `os.remove()` immediately after the API response payload is constructed, ensuring no raw user voice data resides on server disk storage.
- **Client-Side Session State:** Critical user preferences and emergency node settings are handled in `localStorage`. The global "Panic Wipe" module triggers `localStorage.clear()`, wiping state memory instantly.

## Known Behavior: Cold Starts & Free-Tier Hosting

Saheli AI's demonstration backend is hosted on Render's free tier, which introduces specific operational characteristics:

- **Service Spin-Down (Cold Start):** Render automatically spins down free web services after 15 minutes of inactivity. The initial HTTP or WebSocket request after an idle period may experience a 30–50 second latency window while the container boots.
- **Keep-Alive Configuration:** A lightweight `/health` endpoint is configured to receive an automated external `GET` request every 14 minutes via an external cron service (e.g., cron-job.org). This maintains warm container states during active evaluation windows.
- **Single Page Application (SPA) Routing on Vercel:** Direct navigation or refreshing sub-routes (e.g., `/mystory` or `/boldo`) is handled by a root `vercel.json` rewrite configuration (`"source": "/(.*)", "destination": "/index.html"`), routing all path requests through `index.html` to prevent 404 errors.

## Engineering Decisions

- **Web Browser Deployment Over Native Mobile Apps:** Building Saheli AI as a mobile-responsive web application avoids app-store installation records on monitored devices, eliminating a primary vector for abuser discovery.
- **B2B2C Adoption Model via Frontline Proxies:** Directly surveying or pitching victims in high-risk environments introduces danger and produces low response rates due to fear. The platform is architected for adoption by trusted proxies — ASHA workers, Anganwadi coordinators, and local shelter staff who use the platform with survivors on neutral devices.
- **Tailwind-Native Charting:** To eliminate heavy external library overhead (such as Chart.js or Recharts) and ensure maximum compatibility on low-bandwidth mobile devices, all visualization widgets on `MyStory.jsx` are constructed using pure CSS (`conic-gradient`) and flexbox layouts.
- **BNSS 2024 Legal Alignment:** Generated legal complaints are specifically structured for compatibility with e-FIR filing rules introduced under India's Bharatiya Nagarik Suraksha Sanhita (BNSS), allowing complaints to be copy-pasted into official state citizen portals or submitted to the NCW.

## Challenges We Ran Into

- **Audio Buffer Management:** Streamlined handling of native browser MediaRecorder WebM binary chunks over FastAPI, ensuring file header integrity before sending payloads to Groq Whisper.
- **Regional Dialect Translation:** Prompting speech-to-text models to preserve context when transcribing non-standard Hindi, Gujarati, and Marathi dialects without losing critical legal details.
- **Single Page App Route Resolution:** Resolving 404 routing issues on Vercel production deployments when users directly refreshed secondary page paths like `/mystory`.

## Future Roadmap

- **Direct State e-FIR Portal API Integration:** Automating the direct transmission of BolDo Scribe drafts to state police CCTNS citizen portals via official government APIs.
- **Offline First Audio Buffering:** Implementing Progressive Web App (PWA) Service Workers to record audio during network drops and automatically sync telemetry once connectivity is re-established.
- **Expanded Vernacular Dialect Models:** Fine-tuning Whisper models on additional regional Indian dialects (such as Bhojpuri, Marwari, and Kutchi).

## Open-Source Attribution

| Name & Version | License Type | Role in Build | Source Link |
| --- | --- | --- | --- |
| **React (v18.x)** | MIT | Direct integration: Frontend UI framework | [react.dev](https://react.dev/) |
| **Vite (v5.x)** | MIT | Direct integration: Frontend build tool and bundler | [vitejs.dev](https://vitejs.dev/) |
| **Tailwind CSS (v3.x)** | MIT | Direct integration: Utility-first CSS framework | [tailwindcss.com](https://tailwindcss.com/) |
| **FastAPI (v0.100+)** | MIT | Direct integration: Backend REST & WebSocket framework | [fastapi.tiangolo.com](https://fastapi.tiangolo.com/) |
| **Uvicorn** | BSD 3-Clause | Direct integration: ASGI web server | [uvicorn.org](https://www.uvicorn.org/) |
| **Groq Python SDK** | MIT | Direct integration: Speech-to-text (Whisper-large-v3) inference | [github.com/groq/groq-python](https://github.com/groq/groq-python) |
| **Lucide React** | ISC | Direct integration: Vector icons library | [lucide.dev](https://lucide.dev/) |
| **psycopg2-binary** | LGPL | Direct integration: PostgreSQL database adapter | [psycopg.org](https://www.psycopg.org/) |