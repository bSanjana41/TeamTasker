import { useEffect, useState } from "react";
import API from "../../api/API";
import Modal from "../common/Modal";

export default function TaskDetail({ taskId, onBack }) {
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", status: "Todo", priority: "Medium", description: "" });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get(`/tasks/${taskId}`).then(res => setTask(res.data));
    API.get(`/comments/${taskId}`).then(res => setComments(res.data));
    API.get("/users").then(res => setUsers(res.data)).catch(() => setUsers([]));
  }, [taskId]);

  const addComment = (e) => {
    e.preventDefault();
    API.post(`/comments/${taskId}`, { text: newComment }).then(res => {
      setComments([...comments, res.data]);
      setNewComment("");
    });
  };

  const openEdit = () => {
    setEditForm({ title: task.title, status: task.status, priority: task.priority || "Medium", description: task.description || "", assignee: task.assignee?._id || "" });
    setEditing(true);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    const res = await API.put(`/tasks/${taskId}`, editForm);
    setTask(res.data);
    setEditing(false);
  };

  const deleteTask = () => {
    API.delete(`/tasks/${taskId}`).then(() => onBack());
  };

  if (!task) return <p>Loading task...</p>;

  return (
    <div>
      <button onClick={onBack}>Back</button>
      <h2>{task.title}</h2>
      <p>Status: {task.status}</p>
      <p>Priority: {task.priority}</p>
      {/* <p>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}</p> */}

      <button onClick={openEdit}>Edit Task</button>
      <button onClick={deleteTask}>Delete Task</button>

      <h3>Comments</h3>
      <ul>
        {comments.map(c => (
          <li key={c._id}>
            <b>{c.author?.name || "User"}:</b> {c.text}
          </li>
        ))}
      </ul>

      <form onSubmit={addComment}>
        <input
          placeholder="Add comment"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          required
        />
        <button type="submit">Add Comment</button>
      </form>
      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Task"
        actions={(
          <>
            <button onClick={() => setEditing(false)}>Cancel</button>
            <button type="submit" form="task-edit-form">Save</button>
          </>
        )}
      >
        <form id="task-edit-form" onSubmit={submitEdit}>
          <div style={{ display: "grid", gap: 12 }}>
            <input placeholder="Title" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} required />
            <textarea placeholder="Description" rows={4} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label>Status</label>
                <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                  <option>Todo</option>
                  <option>In Progress</option>
                  <option>Done</option>
                </select>
              </div>
              <div>
                <label>Priority</label>
                <select value={editForm.priority} onChange={e => setEditForm({ ...editForm, priority: e.target.value })}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
          <div>
            <label>Assignee</label>
            <select value={editForm.assignee || ""} onChange={e => setEditForm({ ...editForm, assignee: e.target.value || null })}>
              <option value="">Unassigned</option>
              {(Array.isArray(users) ? users : []).map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
