// NotificationList.jsx
import { useEffect, useState } from "react";
import API from "../../api/API";

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    API.get("/notifications").then(res => setNotifications(res.data));
  }, []);

  const markRead = async (id) => {
    const res = await API.put(`/notifications/${id}/read`);
    setNotifications(notifications.map(n => n._id === id ? res.data : n));
  };

  return (
    <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
      <h3 style={{ marginTop: 0 }}>Notifications</h3>
      <ul>
        {notifications.length ? notifications.map(n => (
          <li key={n._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ opacity: n.read ? 0.6 : 1 }}>{n.text}</span>
            {!n.read && <button onClick={() => markRead(n._id)} style={{ padding: "6px 10px" }}>Mark Read</button>}
          </li>
         )) : <li style={{ color: "#a3a3a3" }}>No notifications</li>}
      </ul>
    </div>
  );
}
