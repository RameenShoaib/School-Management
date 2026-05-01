import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Navigation ke liye
import "./Login.css";

const Login = () => {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error message dikhane ke liye
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const navigate = useNavigate();

  // 👇 Login button click hone par yeh function chalega 👇
  const handleLogin = async (e) => {
    e.preventDefault(); // Page reload hone se bachayega
    setError("");
    setIsLoading(true);

    try {
      // Backend ko data bhej rahe hain
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }), // Frontend ka data
      });

      const data = await response.json();

      if (data.success) {
        // Login kamyab! User details local storage mein save kar lein
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Backend se aane wale URL par user ko bhej dein
        navigate(data.redirectUrl);
      } else {
        // Agar password ghalat ho toh error show karein
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
        <div className="icon">📘</div>

        <h2>EduSync</h2>
        <p className="welcome">Welcome back</p>
        <span className="subtitle">Sign in to your account</span>

        <div className="tabs">
          {["admin", "teacher", "student"].map((item) => (
            <button
              key={item}
              className={role === item ? "tab active" : "tab"}
              onClick={() => {
                setRole(item);
                setError(""); // Tab change karne par error hata dein
              }}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>

        {/* Error Message Alert */}
        {error && <div style={{ color: "red", fontSize: "12px", marginBottom: "10px", textAlign: "center" }}>{error}</div>}

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