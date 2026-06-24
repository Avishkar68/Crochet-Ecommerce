import axios from "axios";

// Create axios instance pointing to the backend Render URL or falling back to local server
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://crochet-ecommerce-fzv2.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
