import axios from "axios";

/*
  Dev:
    VITE_API_URL=http://localhost:5000

  Prod (Vercel → Render backend):
    VITE_API_URL=https://your-render-app.onrender.com
*/

// Fallback to localhost if env variable is not set
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Optional global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API Error:",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

// --------------------
// Product APIs
// --------------------

export const createProduct = async (data) => {
  const response = await api.post("/products", data);
  return response.data;
};

export const getProducts = async (params) => {
  const response = await api.get("/products", { params });
  return response.data;
};

// --------------------
// Impact API
// --------------------

export const generateImpact = async (data) => {
  const response = await api.post("/impact", data);
  return response.data;
};