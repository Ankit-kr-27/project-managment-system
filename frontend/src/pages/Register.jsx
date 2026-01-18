import { useState } from "react";
import { register } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      return alert("Username, email and password are required");
    }

    try {
      await register({
        username: username.toLowerCase(),
        fullName,
        email,
        password,
      });

      navigate("/"); // redirect to login
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          padding: "24px",
          borderRadius: "14px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Register</h2>

        <input
          placeholder="Username (lowercase)"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          style={{ width: "100%", marginBottom: "6px", padding: "8px" }}
        />
        <div style={{ fontSize: "12px", color: "#777", marginBottom: "10px" }}>
          Username must be lowercase
        </div>

        <input
          placeholder="Full Name (optional)"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "14px", padding: "8px" }}
        />

        <button style={{ width: "100%" }} onClick={handleRegister}>
          Create Account
        </button>

        <p
          style={{
            marginTop: "14px",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          Already have an account?{" "}
          <span
            style={{ color: "#4f46e5", cursor: "pointer", fontWeight: "500" }}
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
