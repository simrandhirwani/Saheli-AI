import io
import os
import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, UploadFile, File, Form
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

# =====================================================================================
# AUDIO TRANSCRIPTION CORE
# =====================================================================================
# UI language codes map directly to ISO-639-1, which is what Groq/Whisper expects.
SUPPORTED_WHISPER_LANGS = {"en", "hi", "gu", "mr"}

# Below this size a clip is almost certainly silence/noise rather than speech — skip it
# rather than risk Whisper hallucinating text out of near-nothing.
MIN_AUDIO_BYTES = 4000

# Stock phrases Whisper tends to "hallucinate" when fed silence/noise. Filtered out before
# they ever reach a transcript log, the danger-word scan, or a legal draft.
WHISPER_HALLUCINATION_PHRASES = {
    "thank you", "thank you.", "thanks for watching", "please subscribe",
    "subscribe", "you", "bye", "bye bye", "the end", "...", "silence",
    "amara", "namaste",
}

def is_probable_hallucination(text: str) -> bool:
    cleaned = text.strip().lower().strip(".!? ")
    if not cleaned:
        return True
    if cleaned in WHISPER_HALLUCINATION_PHRASES:
        return True
    if len(cleaned) <= 3 and cleaned.isalpha():
        return True
    return False

def transcribe_audio_bytes(audio_bytes: bytes, lang_hint: Optional[str]) -> str:
    """
    Transcribes ONE complete, independently-decodable audio clip. Every caller in this
    file (both websockets and the one-shot REST endpoint) must pass a STANDALONE clip —
    never a raw fragment of a longer stream — or Whisper will produce garbled / wrong-
    language output. Passing an explicit language hint (instead of auto-detect) also
    measurably improves accuracy and latency on short clips.
    """
    audio_stream = io.BytesIO(audio_bytes)
    audio_stream.name = "clip.webm"

    kwargs = {
        "file": audio_stream,
        "model": "whisper-large-v3",
        "response_format": "text",
        "temperature": 0.0,
    }
    if lang_hint in SUPPORTED_WHISPER_LANGS:
        kwargs["language"] = lang_hint

    transcription = groq_client.audio.transcriptions.create(**kwargs)
    return transcription.strip()

# =====================================================================================
# DISTRESS / DANGER KEYWORD BANK (SafeMode only — never applied to BolDo dictation,
# since a survivor narrating her story will naturally use these exact words, and we
# don't want that to falsely trigger a "SafeMode has alerted your contacts" overlay)
# =====================================================================================
DANGER_KEYWORDS = [
    # English
    "help me", "help", "save me", "someone help", "call the police", "call police",
    "let me go", "don't touch me", "stop it", "stop hitting", "i'm scared", "im scared",
    # Hindi
    "बचाओ", "मदद करो", "मदद", "छोड़ो मुझे", "पुलिस बुलाओ", "मुझे बचाओ",
    "bachao", "madad karo", "madad", "chhodo mujhe", "police bulao", "mujhe bachao",
    # Gujarati
    "બચાવો", "મદદ કરો", "મદદ", "છોડો મને", "પોલીસ બોલાવો",
    "bachavo", "madad karo", "chhodo mane", "police bolavo",
    # Marathi
    "वाचवा", "मदत करा", "मदत", "सोडा मला", "पोलिसांना बोलवा",
    "vachva", "madat kara", "soda mala", "policansana bolva",
]

def detect_danger_keyword(text: str) -> Optional[str]:
    if not text:
        return None
    lowered = text.lower()
    for keyword in DANGER_KEYWORDS:
        if keyword.lower() in lowered:
            return keyword
    return None

# =====================================================================================
# PYDANTIC SCHEMAS
# =====================================================================================
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

class BoldoDraftRequest(BaseModel):
    name: str
    transcript: str
    language: str

class SafeModeEvidenceEntry(BaseModel):
    session_id: str
    evidence_type: str
    event_text: str
    raw_payload: Dict[str, object] = {}
    coordinates: Optional[Dict[str, float]] = None
    content_hash: str
    metadata: Optional[str] = None

# =====================================================================================
# HEALTH CHECK — point an uptime cron (UptimeRobot, cron-job.org, etc) at this every
# 10-14 minutes so Render's free tier doesn't spin down before/during your demo.
# =====================================================================================
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }

@app.post("/api/waitlist")
async def join_waitlist(entry: WaitlistEntry):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
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
        system_prompt = (
            f"You are Saheli, an AI legal assistant for women in India. Answer entirely "
            f"in the language corresponding to this language code: '{request.language}' "
            f"(en=English, hi=Hindi, mr=Marathi, gu=Gujarati). Keep answers empathetic, "
            f"legally accurate, and concise. Do not give massive generic disclaimers. "
            f"If the user describes an actionable grievance or violation, explicitly offer "
            f"to draft a 'court-ready formal grievance letter' for them at the end of your response."
        )
        formatted_messages = [{"role": "system", "content": system_prompt}]
        for msg in request.history:
            formatted_messages.append({"role": msg.role, "content": msg.content})
        formatted_messages.append({"role": "user", "content": request.message})

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


# =====================================================================================
# HAQFINDER — ONE-SHOT VOICE INPUT FOR THE CHAT MIC BUTTON
# The mic button in HaqFinder wasn't wired to anything before. This records one clip
# client-side, uploads it whole (so it's always a valid standalone file — no streaming
# fragmentation issue here since it's a single short recording), transcribes it, and
# hands the text back so the frontend can drop it into the message input for review.
# =====================================================================================
@app.post("/api/transcribe")
async def transcribe_single_clip(audio: UploadFile = File(...), lang: str = Form("en")):
    try:
        audio_bytes = await audio.read()
        if len(audio_bytes) < MIN_AUDIO_BYTES:
            return {"text": ""}
        clean_text = transcribe_audio_bytes(audio_bytes, lang)
        if is_probable_hallucination(clean_text):
            return {"text": ""}
        return {"text": clean_text}
    except Exception as e:
        print(f"HaqFinder Voice Transcription Failure: {e}")
        raise HTTPException(status_code=500, detail="Transcription failed")


# =====================================================================================
# BOLDO SCRIBE — REAL LEGAL DRAFT FROM THE ACTUAL TRANSCRIPT
# Previously this was a hardcoded paragraph with only the name swapped in, regardless of
# what was actually said. This drafts from the real narrated account instead.
# =====================================================================================
@app.post("/api/boldo/draft")
async def generate_boldo_draft(request: BoldoDraftRequest):
    try:
        effective_name = request.name.strip() if request.name and request.name.strip() else "[Complainant Name]"
        clean_transcript = request.transcript.strip()

        if not clean_transcript:
            raise HTTPException(status_code=400, detail="Empty transcript")

        system_prompt = (
            "You are Saheli's legal drafting assistant. You write formal, court-ready domestic "
            "violence / cruelty grievance letters for Indian authorities, based ONLY on a "
            "survivor's own spoken account. Use only the specific facts, incidents, and dates she "
            "actually mentioned — never invent details she did not say. Structure it as a formal "
            "letter addressed 'To, The Station House Officer (SHO), [Jurisdiction Police Station]', "
            "and cite current Indian law provisions that fit the facts described. Prefer the "
            "Bharatiya Nyaya Sanhita (BNS) over old IPC references, and select the most relevant "
            "provisions for the conduct described, such as BNS Sections 85 and 86 for cruelty by "
            "husband/relatives where applicable, and the Protection of Women from Domestic "
            "Violence Act, 2005 (PWDVA) where relevant. If the facts involve other current offenses, "
            "choose the most appropriate BNS/BNSS/PWDVA provisions based on the account and mention "
            "them clearly in the letter. Do not use IPC sections or outdated legal references. "
            f"Write in first person as the complainant, {effective_name}. Respond with ONLY the "
            f"letter text — no preamble, no explanation, no markdown formatting. Write it in the "
            f"language matching this code: '{request.language}' (en=English, hi=Hindi, mr=Marathi, "
            f"gu=Gujarati)."
        )

        completion = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Here is my spoken account:\n\n{clean_transcript}"}
            ],
            temperature=0.3,
            max_tokens=900,
        )
        draft_text = completion.choices[0].message.content.strip()
        return {"draft": draft_text}
    except HTTPException:
        raise
    except Exception as e:
        print(f"BolDo Draft Generation Failure: {e}")
        raise HTTPException(status_code=500, detail="Draft generation failed")


# =====================================================================================
# SAFEMODE: 24-HOUR LOG HISTORY
# =====================================================================================
@app.get("/api/safemode/logs/{session_id}")
async def get_transient_logs(session_id: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        twenty_four_hours_ago = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=24)
        cursor.execute("""
            SELECT log_text as text, created_at as timestamp
            FROM safemode_logs
            WHERE session_id = %s AND created_at >= %s
            ORDER BY created_at ASC;
        """, (session_id, twenty_four_hours_ago))
        logs = cursor.fetchall()
        cursor.close()
        conn.close()
        return logs
    except Exception as e:
        print(f"Database Fetch Crash: {e}")
        return []


@app.post("/api/safemode/evidence")
async def store_safemode_evidence(entry: SafeModeEvidenceEntry):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS safemode_evidence (
                id SERIAL PRIMARY KEY,
                session_id VARCHAR(255),
                evidence_type VARCHAR(50),
                event_text TEXT,
                raw_payload JSONB DEFAULT '{}',
                coordinates JSONB DEFAULT '{}',
                created_at TIMESTAMPTZ DEFAULT NOW(),
                content_hash VARCHAR(128),
                metadata TEXT
            );
        """)
        cursor.execute("""
            INSERT INTO safemode_evidence
            (session_id, evidence_type, event_text, raw_payload, coordinates, content_hash, metadata)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
        """, (
            entry.session_id,
            entry.evidence_type,
            entry.event_text,
            entry.raw_payload,
            entry.coordinates,
            entry.content_hash,
            entry.metadata,
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return {"status": "stored", "hash": entry.content_hash}
    except Exception as e:
        print(f"SafeMode Evidence Store Failed: {e}")
        return {"status": "queued_locally", "hash": entry.content_hash}


@app.get("/api/safemode/evidence/{session_id}")
async def get_safemode_evidence(session_id: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT id, session_id, evidence_type, event_text, raw_payload, coordinates, created_at, content_hash, metadata
            FROM safemode_evidence
            WHERE session_id = %s
            ORDER BY created_at DESC;
        """, (session_id,))
        records = cursor.fetchall()
        cursor.close()
        conn.close()
        return records
    except Exception as e:
        print(f"SafeMode Evidence Fetch Failed: {e}")
        return []


# =====================================================================================
# SAFEMODE WEBSOCKET
# The frontend now sends one COMPLETE, independently-decodable audio clip per message
# (it stops and restarts its recorder every few seconds instead of streaming raw
# fragments of one long recording). That's why this endpoint transcribes each received
# message directly, with NO buffering/accumulation — accumulating fragments was what
# broke the WebM container structure and caused both the hallucinated text and the
# "stops listening after ~10s" symptom.
# =====================================================================================
@app.websocket("/ws/safemode/{session_id}")
async def safemode_websocket(websocket: WebSocket, session_id: str):
    lang_hint = websocket.query_params.get("lang", "en")
    await websocket.accept()
    print(f"WebSocket Connected Session (SafeMode): {session_id} | lang={lang_hint}")

    try:
        while True:
            data = await websocket.receive_bytes()
            if len(data) < MIN_AUDIO_BYTES:
                continue

            try:
                clean_text = transcribe_audio_bytes(data, lang_hint)
                if not clean_text or is_probable_hallucination(clean_text):
                    continue

                timestamp_str = datetime.datetime.now(datetime.timezone.utc).isoformat()

                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO safemode_logs (session_id, log_text, created_at) VALUES (%s, %s, %s);",
                    (session_id, clean_text, timestamp_str)
                )
                conn.commit()
                cursor.close()
                conn.close()

                await websocket.send_json({
                    "type": "TRANSCRIPT",
                    "data": {"timestamp": timestamp_str, "text": clean_text}
                })

                matched_keyword = detect_danger_keyword(clean_text)
                if matched_keyword:
                    await websocket.send_json({
                        "type": "DANGER_ALERT",
                        "data": {"timestamp": timestamp_str, "text": clean_text, "keyword": matched_keyword}
                    })
            except Exception as e:
                print(f"SafeMode Processing Exception Tracker: {e}")

    except WebSocketDisconnect:
        print(f"SafeMode session disconnected cleanly: {session_id}")


# =====================================================================================
# BOLDO SCRIBE WEBSOCKET
# Deliberately separate from SafeMode: no danger-keyword scan, no DB persistence — just
# clean transcription of each standalone segment, appended client-side into one running
# transcript that gets sent to /api/boldo/draft once recording stops.
# =====================================================================================
@app.websocket("/ws/boldo/{session_id}")
async def boldo_websocket(websocket: WebSocket, session_id: str):
    lang_hint = websocket.query_params.get("lang", "en")
    await websocket.accept()
    print(f"WebSocket Connected Session (BolDo): {session_id} | lang={lang_hint}")

    try:
        while True:
            data = await websocket.receive_bytes()
            if len(data) < MIN_AUDIO_BYTES:
                continue

            try:
                clean_text = transcribe_audio_bytes(data, lang_hint)
                if not clean_text or is_probable_hallucination(clean_text):
                    continue

                await websocket.send_json({
                    "type": "TRANSCRIPT",
                    "data": {
                        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                        "text": clean_text
                    }
                })
            except Exception as e:
                print(f"BolDo Processing Exception Tracker: {e}")

    except WebSocketDisconnect:
        print(f"BolDo session disconnected cleanly: {session_id}")


milestones_db = []

@app.get("/api/pehchaan/milestones", response_model=List[Milestone])
async def get_milestones():
    return milestones_db

@app.post("/api/pehchaan/milestones")
async def add_milestone(milestone: Milestone):
    milestones_db.insert(0, milestone)
    return {"status": "success", "message": "Milestone successfully broadcasted"}
