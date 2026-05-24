import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardForRole } from "../../components/ProtectedRoute";
import "./Login.css";

const Login = () => {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser?.role) {
        navigate(getDashboardForRole(savedUser.role), { replace: true });
      }
    } catch {
      localStorage.removeItem("user");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate(getDashboardForRole(data.user.role), { replace: true });
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Cannot connect to server. Please ensure backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="icon">ED</div>

        <h2>EduSync</h2>
        <p className="welcome">Welcome back</p>
        <span className="subtitle">Sign in to your account</span>

        <div className="tabs">
          {["admin", "teacher", "student"].map((item) => (
            <button
              key={item}
              type="button"
              className={role === item ? "tab active" : "tab"}
              onClick={() => {
                setRole(item);
                setError("");
              }}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ color: "red", fontSize: "12px", marginBottom: "10px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form className="form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email address"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="loginBtn" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="forgot">Forgot password?</p>
      </div>
    </div>
  );
};

export default Login;
