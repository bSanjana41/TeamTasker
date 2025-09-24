import { useEffect, useState } from "react";
import API from "../../api/API";

export default function Analytics() {
  const [perDay, setPerDay] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [statusCounts, setStatusCounts] = useState([]);

  useEffect(() => {
    Promise.all([
      API.get("/analytics/tasks-per-day?days=7"),
      API.get("/analytics/top-completers?limit=5"),
      API.get("/analytics/status-counts"),
    ]).then(([a, b, c]) => {
      setPerDay(a.data);
      setTopUsers(b.data);
      setStatusCounts(c.data);
    }).catch(() => {
      // noop basic error
    });
  }, []);

  const card = { background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 };

  return (
    <div style={{ display: "grid", gap: 16, marginBottom: 16 }}>
      <h2 style={{ margin: 0, marginBottom: 4 }}>Analytics</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        <section style={card}>
          <h3 style={{ marginTop: 0, fontSize: 16 }}>Tasks created per day (7d)</h3>
          <ul>
            {perDay.length ? perDay.map(row => (
              <li key={row.date} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#a3a3a3" }}>{row.date}</span>
                <strong>{row.count}</strong>
              </li>
            )) : <li style={{ color: "#a3a3a3" }}>No data</li>}
          </ul>
        </section>

        <section style={card}>
          <h3 style={{ marginTop: 0, fontSize: 16 }}>Top completers</h3>
          <ul>
            {topUsers.length ? topUsers.map((row, idx) => (
              <li key={idx} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#a3a3a3" }}>{String(row._id) === "null" ? "Unassigned" : String(row._id)}</span>
                <strong>{row.completed}</strong>
              </li>
            )) : <li style={{ color: "#a3a3a3" }}>No data</li>}
          </ul>
        </section>

        <section style={card}>
          <h3 style={{ marginTop: 0, fontSize: 16 }}>Status counts</h3>
          <ul>
            {statusCounts.length ? statusCounts.map(row => (
              <li key={row.status} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#a3a3a3" }}>{row.status}</span>
                <strong>{row.count}</strong>
              </li>
            )) : <li style={{ color: "#a3a3a3" }}>No data</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}


