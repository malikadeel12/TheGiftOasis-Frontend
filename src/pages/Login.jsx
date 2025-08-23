import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../services/api"; 

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
      alert(res.data.message || "Login Successful!");
       const token = res.data.token;
       localStorage.setItem("token", token);
       const decoded = jwtDecode(token);
       if (decoded.role === "admin") navigate("/admin");
       else navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(rgba(255, 192, 203, 0.85), rgba(255, 182, 193, 0.9)), url('https://i.pinimg.com/736x/15/dc/b9/15dcb94b2b64ef5d95de2f781f325a2c.jpg') center/cover no-repeat",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins', sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#d63384",
          }}
        >
          Welcome Back 💖
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: "#d63384",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              transition: "0.3s",
              opacity: loading ? 0.7 : 1,
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#b02a6f")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = "#d63384")
            }
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p style={{ textAlign: "center", marginTop: "15px" }}>
            Don’t have an account?{" "}
            <a href="/register" style={{ color: "#d63384", fontWeight: "bold" }}>
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
