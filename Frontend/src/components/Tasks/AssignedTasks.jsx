import { useEffect, useState } from "react";
import API from "../../api/API";

export default function AssignedTasks({ onSelectTask }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get("/tasks/assigned")
      .then(res => setTasks(res.data))
      .catch(() => alert("Could not load assigned tasks"));
  }, []);

  const panel = { background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 };
  const chip = (bg) => ({ display: "inline-block", padding: "2px 8px", borderRadius: 999, background: bg, color: "#0a0a0a", fontSize: 12, fontWeight: 600 });

  if (!tasks.length) return <p style={{ color: "#a3a3a3" }}>No tasks assigned to you</p>;

  return (
    <div style={panel}>
      <h3 style={{ marginTop: 0 }}>Tasks Assigned to Me</h3>
      <ul style={{ display: "grid", gap: 12 }}>
        {tasks.map(t => (
          <li key={t._id} style={{ display: "grid", gap: 4, borderBottom: "1px solid #e0e0e0", paddingBottom: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <b>{t.title}</b>
              <span style={chip(t.status === "Done" ? "#9bffba" : t.status === "In Progress" ? "#ffd29b" : "#c7d2fe")}>{t.status}</span>
            </div>
            {t.project?.title && <p style={{ margin: 0, color: "#a3a3a3" }}>Project: {t.project.title}</p>}
            <div style={{ display: "flex", gap: 8 }}>
              <span style={chip(t.priority === "High" ? "#ffb3b3" : t.priority === "Medium" ? "#ffe066" : "#ffe096")}>{t.priority}</span>
              <span style={chip("#ffe066")}>Assigned to me</span>
            </div>
            <button onClick={() => onSelectTask(t._id)}>View</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
