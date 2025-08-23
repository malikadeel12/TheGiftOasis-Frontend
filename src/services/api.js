import axios from "axios";

const API = axios.create({
  baseURL: "https://thegiftoasis-backend.onrender.com/api",

  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = (formData) => API.post("/users/register", formData);
//for login
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
