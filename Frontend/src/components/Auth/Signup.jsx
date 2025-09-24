import { useState } from "react";
import API from "../../api/API";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login} =useContext(AuthContext)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", { name, email, password });
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 500) {
        alert("Server error. Please try again later.");
      } else {
        alert(err.response?.data?.error || "Signup failed");
      }
    }
  };
  

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16 }}>
      <div style={{ width: "min(420px, 92vw)", background: "#141418", color: "#f5f5f5", border: "1px solid #23232a", borderRadius: 12, padding: 24 }}>
        <h2 style={{ marginTop: 0 }}>Create your account</h2>
        <p style={{ color: "#a3a3a3", marginTop: 4 }}>Join TeamTasker to manage projects, tasks and collaborate.</p>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 16 }}>
          <div>
            <label>Name</label>
            <input placeholder="Jane Doe" value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div>
            <label>Email</label>
            <input placeholder="jane@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Password</label>
            <input placeholder="••••••••" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button type="submit">Create account</button>
        </form>
        <p style={{ marginTop: 16, color: "#a3a3a3" }}>
          Already have an account? <Link to="/login" style={{ color: "#9fa8ff" }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
