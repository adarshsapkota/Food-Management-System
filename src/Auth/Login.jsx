import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { jwtDecode } from "jwt-decode";
import instance from "../axios/axiosinstance";

function LogIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || !formData.email || !formData.password) return;

    setLoading(true);
    setError("");

    try {
      const response = await instance.post("/api/auth/login", {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      });

      const token = response.data?.token || response.data;
      if (!token) throw new Error("No authentication token received");

      const decoded = jwtDecode(token);
      if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
        throw new Error("Token is expired");
      }

      localStorage.setItem("authToken", token);
      localStorage.setItem(
        "userDetails",
        JSON.stringify({
          employeeName: decoded.employeeName,
          phoneNumber: decoded.phoneNumber,
          email: decoded.email,
          hireDate: decoded.hireDate,
          roles: decoded.roles,
        })
      );

      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await new Promise((resolve) => setTimeout(resolve, 10));
      console.log("Stored token:", localStorage.getItem("authToken"));
      console.log("User details:", localStorage.getItem("userDetails"));

      const redirectPath = decoded.roles?.includes("ADMIN")
        ? "/admindash"
        : "/userdash";
      navigate(redirectPath);
    } catch (err) {
      console.error("Login error:", err);

      localStorage.removeItem("authToken");
      localStorage.removeItem("userDetails");
      delete instance.defaults.headers.common["Authorization"];

      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Welcome Back</h2>

        {error && (
          <div className="error-message">
            {error}
            <button
              type="button"
              onClick={() => setError("")}
              className="error-close"
            >
              ×
            </button>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="username"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className={`login-button ${loading ? "loading" : ""}`}
          disabled={loading || !formData.email || !formData.password}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <div className="login-footer">
          <span>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </span>
          <Link to="/forgot-password" className="forgot-password">
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LogIn;
