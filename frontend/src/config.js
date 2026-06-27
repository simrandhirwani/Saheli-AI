// Automatically detect if the app is running locally or on a production server
const isLocal = window.location.hostname === 'localhost';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://saheli-ai.onrender.com';
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || (
  isLocal ? 'ws://localhost:8000' : 'wss://saheli-ai.onrender.com'
);


