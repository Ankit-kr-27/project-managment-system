import { useState } from "react";
import { login } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      return alert("Email and password are required");
    }

    try {
      const res = await login({ email, password });
      localStorage.setItem("accessToken", res.data.data.accessToken);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
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
          maxWidth: "400px",
          background: "white",
          padding: "24px",
          borderRadius: "14px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "14px", padding: "8px" }}
        />

        <button style={{ width: "100%" }} onClick={handleLogin}>
          Login
        </button>

        <p
          style={{
            marginTop: "14px",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          Don’t have an account?{" "}
          <span
            style={{ color: "#4f46e5", cursor: "pointer", fontWeight: "500" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
