// Automatically detect if the app is running locally or on a production server
const isLocal = window.location.hostname === 'localhost';

export const API_BASE_URL = isLocal 
  ? 'http://localhost:8000' 
  : 'https://saheli-backend.onrender.com'; // Replace with your future Render URL

export const WS_BASE_URL = isLocal 
  ? 'ws://localhost:8000' 
  : 'wss://saheli-backend.onrender.com'; // Notice the secure 'wss' protocol for production