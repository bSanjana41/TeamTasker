import { useEffect } from "react";

export default function Modal({ open, onClose, title, children, actions }) {
  useEffect(() => {
    const onEsc = (e) => { if (e.key === "Escape") onClose?.(); };
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "min(520px, 92vw)", background: "#121212", color: "#f5f5f5",
        borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        border: "1px solid #2a2a2a"
      }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #222" }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>{title}</h3>
        </div>
        <div style={{ padding: 18 }}>{children}</div>
        <div style={{ padding: 14, borderTop: "1px solid #222", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          {actions}
        </div>
      </div>
    </div>
  );
}


