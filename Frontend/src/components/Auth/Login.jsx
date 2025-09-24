import { useState, useContext } from "react";
import API from "../../api/API";
import { AuthContext } from "../../context/AuthContext";
import { Link,useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data);
      console.log(res.data)
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16 }}>
      <div style={{ width: "min(420px, 92vw)", background: "#141418", color: "#f5f5f5", border: "1px solid #23232a", borderRadius: 12, padding: 24 }}>
        <h2 style={{ marginTop: 0 }}>Welcome back</h2>
        <p style={{ color: "#a3a3a3", marginTop: 4 }}>Log in to continue to your workspace.</p>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 16 }}>
          <div>
            <label>Email</label>
            <input placeholder="jane@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Password</label>
            <input placeholder="••••••••" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit">Log in</button>
        </form>
        <p style={{ marginTop: 16, color: "#a3a3a3" }}>
          Don’t have an account? <Link to="/signup" style={{ color: "#9fa8ff" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
