import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverResponse, setServerResponse] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Prepare file to send to FastAPI
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.webm");

        try {
          const response = await fetch("http://localhost:8000/api/audio", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          setServerResponse(data.message);
        } catch (error) {
          console.error("Error sending audio:", error);
          setServerResponse("Failed to connect to backend.");
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setServerResponse("");
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Please allow microphone access to use Saheli.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all audio tracks to turn off the red recording dot in the browser tab
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-slate-900 rounded-xl border border-slate-800 shadow-lg">
      <div className="flex items-center gap-4">
        {!isRecording ? (
          <button 
            onClick={startRecording}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-saheli-pink hover:bg-rose-700 text-white px-6 py-3 rounded-full font-bold transition-all"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <Mic />}
            {isProcessing ? "Processing..." : "Tap to Speak"}
          </button>
        ) : (
          <button 
            onClick={stopRecording}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-full font-bold transition-all animate-pulse"
          >
            <Square size={18} className="text-saheli-pink" />
            Stop Recording
          </button>
        )}
      </div>
      
      {serverResponse && (
        <div className="text-sm text-green-400 font-medium bg-green-400/10 px-4 py-2 rounded-md">
          Backend says: {serverResponse}
        </div>
      )}
    </div>
  );
}