import axios from "axios";

// check environment
const API = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000/api" // local backend
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
