import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Projects from "../Projects/Projects";
import NotificationList from "../Notifications/NotificationList";
import TaskDetail from "../Tasks/Task";
import Analytics from "./Analytics";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  if (loading) return <p>Loading...</p>;

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <div style={{ padding: "24px 16px", maxWidth: 1200, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
        <div>
          <h1 style={{ margin: 0 }}>Hi {user?.name || "there"}!</h1>
          <p style={{ color: "var(--muted)", margin: 0 }}>Let’s get things done today.</p>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <main style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 340px", gap: 16 }}>
        {!selectedTaskId ? (
          <>
            <div>
              <Analytics />
              <Projects onSelectTask={setSelectedTaskId} />
            </div>
            <aside>
              <NotificationList />
            </aside>
          </>
        ) : (
          <div style={{ gridColumn: "1 / span 2" }}>
            <TaskDetail taskId={selectedTaskId} onBack={() => setSelectedTaskId(null)} />
          </div>
        )}
      </main>
    </div>
  );
}
