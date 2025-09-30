import axios from "axios";

// check environment
//age kafi ma na loacl changing krni hui ya check krna hua iss domain ki https://api.thegiftoasis.store ma http://localhost:5000/api kru ga
const API = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "https://api.thegiftoasis.store" // domain
      : "https://thegiftoasis-backend.onrender.com/api", // deployed backend

  headers: {
    "Content-Type": "application/json",
  },
});

// register user
export const registerUser = (formData) => API.post("/users/register", formData);

// auth interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
