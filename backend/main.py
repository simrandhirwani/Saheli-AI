import io
import os
import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
from groq import Groq

load_dotenv()

app = FastAPI()

PRODUCTION_ORIGINS = [
    "http://localhost:5173",
    "https://saheli-ai-psi.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=PRODUCTION_ORIGINS, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
DB_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    return psycopg2.connect(DB_URL)

# --- PYDANTIC SCHEMAS FOR HAQFINDER CHAT ---
class WaitlistEntry(BaseModel):
    name: str
    email: str
    source: str
    beta_optin: bool
    community_optin: bool

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage]
    language: str

class Milestone(BaseModel):
    user: str
    city: str
    text: str
    time: str
    hearts: int
    comments: int

# --- HAQFINDER SECURE CHAT ENDPOINT ---

@app.post("/api/waitlist")
async def join_waitlist(entry: WaitlistEntry):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Auto-create the table for the hackathon
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS waitlist (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                source VARCHAR(50),
                beta_optin BOOLEAN,
                community_optin BOOLEAN,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Insert the data
        cursor.execute("""
            INSERT INTO waitlist (name, email, source, beta_optin, community_optin)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (email) DO NOTHING; 
        """, (entry.name, entry.email, entry.source, entry.beta_optin, entry.community_optin))
        
        conn.commit()
        cursor.close()
        conn.close()
        return {"status": "success"}
    except Exception as e:
        print(f"Waitlist DB Error: {e}")
        raise HTTPException(status_code=500, detail="Database insertion failed")


@app.post("/api/haqfinder/chat")
async def process_haqfinder_chat(request: ChatRequest):
    try:
        # Build out structural system behavior based on custom localization strings
        system_prompt = (
            f"You are Saheli, an AI legal assistant for women in India. Answer entirely "
            f"in the language corresponding to this language code: '{request.language}' "
            f"(en=English, hi=Hindi, mr=Marathi, gu=Gujarati). Keep answers empathetic, "
            f"legally accurate, and concise. Do not give massive generic disclaimers. "
            f"If the user describes an actionable grievance or violation, explicitly offer "
            f"to draft a 'court-ready formal grievance letter' for them at the end of your response."
        )

        # Map current runtime history configuration to Groq structure
        formatted_messages = [{"role": "system", "content": system_prompt}]
        for msg in request.history:
            formatted_messages.append({"role": msg.role, "content": msg.content})
        
        # Append current user prompt slice
        formatted_messages.append({"role": "user", "content": request.message})

        # Secure server-side call via execution client loop
        completion = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=formatted_messages,
            temperature=0.5,
            max_tokens=1024
        )

        bot_reply = completion.choices[0].message.content
        return {"reply": bot_reply}

    except Exception as e:
        print(f"HaqFinder Chat Core Failure: {e}")
        raise HTTPException(status_code=500, detail="Internal LLM Processing Error")

# --- HTTP GET ENDPOINT ---
@app.get("/api/safemode/logs/{session_id}")
async def get_transient_logs(session_id: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        one_hour_ago = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=1)
        
        query = """
            SELECT log_text as text, created_at as timestamp 
            FROM safemode_logs 
            WHERE session_id = %s AND created_at >= %s
            ORDER BY created_at ASC;
        """
        cursor.execute(query, (session_id, one_hour_ago))
        logs = cursor.fetchall()
        
        cursor.close()
        conn.close()
        return logs
    except Exception as e:
        print(f"Database Fetch Crash: {e}")
        return []

# --- WEBSOCKET ENDPOINT (Explicitly attached to app root to eliminate 404s) ---
@app.websocket("/ws/safemode/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    audio_buffer = bytearray()
    print(f"WebSocket Connected Session: {session_id}")
    
    try:
        while True:
            data = await websocket.receive_bytes()
            audio_buffer.extend(data)
            
            # Process block once threshold capacity reached
            if len(audio_buffer) >= 48000:
                try:
                    # FIX: Read memory as an isolated, valid virtual file stream object
                    # This completely avoids read/write permission errors on Render containers
                    audio_stream = io.BytesIO(audio_buffer)
                    audio_stream.name = "audio_telemetry.webm"  # Whisper requires an explicit extension signature
                    
                    transcription = groq_client.audio.transcriptions.create(
                        file=audio_stream,
                        model="whisper-large-v3",
                        response_format="text"
                    )
                    
                    if transcription.strip():
                        timestamp_str = datetime.datetime.now(datetime.timezone.utc).isoformat()
                        
                        # Persist telemetry records into the Neon instance
                        conn = get_db_connection()
                        cursor = conn.cursor()
                        insert_query = """
                            INSERT INTO safemode_logs (session_id, log_text, created_at)
                            VALUES (%s, %s, %s);
                        """
                        cursor.execute(insert_query, (session_id, transcription.strip(), timestamp_str))
                        conn.commit()
                        cursor.close()
                        conn.close()
                        
                        await websocket.send_json({
                            "type": "TRANSCRIPT",
                            "data": {
                                "timestamp": timestamp_str,
                                "text": transcription.strip()
                            }
                        })
                except Exception as e:
                    print(f"Production Processing Exception Tracker: {e}")
                finally:
                    audio_buffer.clear()
                    
    except WebSocketDisconnect:
        print(f"Session disconnected cleanly: {session_id}")

milestones_db = []

@app.get("/api/pehchaan/milestones", response_model=List[Milestone])
async def get_milestones():
    return milestones_db

@app.post("/api/pehchaan/milestones")
async def add_milestone(milestone: Milestone):
    # Insert new milestones at the front of the list so they appear at the top of the feed
    milestones_db.insert(0, milestone)
    return {"status": "success", "message": "Milestone successfully broadcasted"}