// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import toast from "react-hot-toast";
import { LoadingButton } from "../components/LoadingSpinner";
import { Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/users/login", formData);
      toast.success("Login successful!");
      const token = res.data.token;
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("authChange"));
      const decoded = jwtDecode(token);
      if (decoded.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-2">
          Welcome Back 💖
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Sign in to continue to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:outline-none transition"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-pink-500" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-pink-600 hover:text-pink-700 font-medium">
              Forgot password?
            </Link>
          </div>

          <LoadingButton
            type="submit"
            loading={loading}
            loadingText="Signing in..."
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >
            Sign In
            <ArrowRight size={18} />
          </LoadingButton>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-pink-600 hover:text-pink-700 font-semibold">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
