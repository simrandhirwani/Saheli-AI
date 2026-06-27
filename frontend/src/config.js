// Automatically detect if the app is running locally or on a production server
const isLocal = window.location.hostname === 'localhost';


export const API_BASE_URL = 'https://saheli-ai.onrender.com';

export const WS_BASE_URL = isLocal 
  ? 'ws://localhost:8000' 
  : 'https://saheli-ai.onrender.com'; // Notice the secure 'wss' protocol for production