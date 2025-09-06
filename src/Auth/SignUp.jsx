import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import instance from "../axios/axiosinstance";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      };

      const response = await instance.post("/api/auth/register", payload, {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        navigate("/Dashboard");
      } else {
        navigate("/", { state: { signupSuccess: true } });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2 className="signup-title">Create Account</h2>

        {error && <div className="signup-error-message">{error}</div>}

        <div className="signup-form-group">
          <label className="signup-label">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            minLength="3"
            className="signup-input"
          />
        </div>

        <div className="signup-form-group">
          <label className="signup-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>

        <div className="signup-form-group">
          <label className="signup-label">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>

        <div className="signup-form-group">
          <label className="signup-label">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
            className="signup-input"
          />
        </div>

        <div className="signup-form-group">
          <label className="signup-label">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>

        <button type="submit" disabled={loading} className="signup-button">
          {loading ? "Registering..." : "Sign Up"}
        </button>

        <div className="signup-login-link">
          Already have an account? <Link to="/">Log In</Link>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
