import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Backend ka base URL
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
