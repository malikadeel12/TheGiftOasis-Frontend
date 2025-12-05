import axios from "axios";

// check environment
// const API = axios.create({
//   baseURL:
//     process.env.NODE_ENV === "development"
//       ? "http://localhost:5000/api" // ✅ local testing
//       : "https://api.thegiftoasis.store", // 🌐 live domain

//   headers: {
//     "Content-Type": "application/json",
//   },
// });

//age kafi ma na loacl changing krni hui ya check krna hua iss domain ki https://api.thegiftoasis.store ma http://localhost:5000/api kru ga
// Determine base URL - check multiple conditions for development
// IMPORTANT: In development, always use localhost, ignore VITE_API_BASE_URL
const isDevelopment = 
  import.meta.env.DEV || 
  import.meta.env.MODE === "development" ||
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const baseURL = isDevelopment
  ? "http://localhost:5000/api" // ✅ local testing (always use localhost in dev, ignore .env)
  : (import.meta.env.VITE_API_BASE_URL || "https://thegiftoasis-backend.onrender.com/api"); // production: use .env or fallback

console.log("🔧 API Base URL:", baseURL, "| Development:", isDevelopment);

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// register user
export const registerUser = (formData) => API.post("/users/register", formData);

// Order endpoints
export const createOrder = (orderData) => API.post("/orders/create", orderData);
export const getOrder = (identifier) => API.get(`/orders/${identifier}`);
export const getMyOrders = () => API.get("/orders/user/history");
export const getAllOrders = (params) => API.get("/orders/admin/all", { params });
export const updateOrderStatus = (id, status, notes) => API.put(`/orders/admin/update-status/${id}`, { status, notes });
export const getOrderStats = () => API.get("/orders/admin/stats");

// Product marketing & reviews
export const getHighlights = () => API.get("/admin/highlights");
export const getProductById = (id) => API.get(`/admin/${id}`);
export const getProductReviews = (id) => API.get(`/admin/${id}/reviews`);
export const saveProductReview = (id, payload) => API.post(`/admin/${id}/reviews`, payload);
export const deleteProductReview = (id, reviewId) => API.delete(`/admin/${id}/reviews/${reviewId}`);

// Blog API
export const getBlogPosts = (params) => API.get("/blog", { params });
export const getBlogPostBySlug = (slug) => API.get(`/blog/slug/${slug}`);
export const getAllBlogPostsAdmin = () => API.get("/blog/admin/all");
export const createBlogPost = (payload) => API.post("/blog", payload);
export const updateBlogPost = (id, payload) => API.put(`/blog/${id}`, payload);
export const deleteBlogPost = (id) => API.delete(`/blog/${id}`);

// auth interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
