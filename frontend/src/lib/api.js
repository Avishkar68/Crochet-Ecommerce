import axios from "axios";

// Create axios instance pointing to the backend Render URL or falling back to local server
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
