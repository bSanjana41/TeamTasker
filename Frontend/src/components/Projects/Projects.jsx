import { useEffect, useState } from "react";
import API from "../../api/API";
import Modal from "../common/Modal";

export default function Projects({ onSelectTask }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [tasks, setTasks] = useState([]);

  // UI state: modals/forms
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const initialTaskForm = { title: "", description: "", status: "Todo", priority: "Medium" };
  const [taskForm, setTaskForm] = useState(initialTaskForm);
  const [users, setUsers] = useState([]);

  // Load all projects
  useEffect(() => {
    API.get("/projects")
      .then(res => setProjects(res.data))
      .catch(() => alert("Could not load projects"));
  }, []);

  // Load tasks for selected project
  const loadTasks = async (project) => {
    try {
      console.log(project._id)
      const res = await API.get(`/tasks/project/${project._id}`);
      setTasks(res.data);
      setSelectedProject(project);
    } catch {
      alert("Could not load tasks");
    }
  };

  // Load users for assignee dropdown
  useEffect(() => {
    API.get("/users").then(res => setUsers(res.data)).catch(() => setUsers([]));
  }, []);

  // --- Project CRUD ---
  const addProject = async (e) => {
    e.preventDefault();
    if (!newTitle) return;
    const res = await API.post("/projects", { title: newTitle, description: newDesc });
    setProjects([...projects, res.data]);
    setNewTitle(""); setNewDesc("");
    setShowProjectModal(false);
  };

  const openEditProject = (p) => {
    setEditingProject(p);
    setNewTitle(p.title);
    setNewDesc(p.description || "");
    setShowProjectModal(true);
  };

  const submitEditProject = async (e) => {
    e.preventDefault();
    if (!editingProject) return;
    const res = await API.put(`/projects/${editingProject._id}`, { title: newTitle, description: newDesc });
    setProjects(projects.map(pr => pr._id === editingProject._id ? res.data : pr));
    if (selectedProject?._id === editingProject._id) setSelectedProject(res.data);
    setEditingProject(null);
    setNewTitle(""); setNewDesc("");
    setShowProjectModal(false);
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await API.delete(`/projects/${id}`);
    setProjects(projects.filter(pr => pr._id !== id));
    if (selectedProject?._id === id) setSelectedProject(null);
  };

  // --- Task CRUD ---
  const openAddTask = () => {
    if (!selectedProject?._id) { alert("Select a project first"); return; }
    setEditingTask(null);
    setTaskForm(initialTaskForm);
    setShowTaskModal(true);
  };

  const submitAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/tasks", {
        title: taskForm.title,
        description: taskForm.description,
        project: selectedProject._id,
        status: taskForm.status,
        priority: taskForm.priority,
        assignee: taskForm.assignee || null,
      });
      // Reload from server to reflect assignment and computed fields
      await loadTasks(selectedProject);
      setShowTaskModal(false);
      setTaskForm(initialTaskForm);
    } catch (err) {
      console.error(err);
      alert("Failed to add task");
    }
  };
  const openEditTask = (t) => {
    setEditingTask(t);
    setTaskForm({
      title: t.title,
      description: t.description || "",
      status: t.status,
      priority: t.priority || "Medium",
      assignee: (t.assignee && (t.assignee._id || t.assignee)) || ""
    });
    setShowTaskModal(true);
  };

  const submitEditTask = async (e) => {
    e.preventDefault();
    if (!editingTask) return;
    const res = await API.put(`/tasks/${editingTask._id}`, {
      title: taskForm.title,
      description: taskForm.description,
      status: taskForm.status,
      priority: taskForm.priority,
      assignee: taskForm.assignee || null,
    });
    // Reload to ensure assignee/priority/status reflect latest server values
    await loadTasks(selectedProject);
    setEditingTask(null);
    setShowTaskModal(false);
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await API.delete(`/tasks/${id}`);
    setTasks(tasks.filter(t => t._id !== id));
  };

  // --- Render ---
  if (selectedProject) {
    const panel = { background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 };
    const chip = (bg) => ({ display: "inline-block", padding: "2px 8px", borderRadius: 999, background: bg, color: "#0a0a0a", fontSize: 12, fontWeight: 600 });

    return (
      <div style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setSelectedProject(null)}>⬅ Back to Projects</button>
          <div style={{ marginLeft: 8 }}>
            <h2 style={{ margin: 0 }}>{selectedProject.title}</h2>
            <p style={{ marginTop: 4, color: "#a3a3a3" }}>{selectedProject.description || "No description"}</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { setEditingProject(selectedProject); setNewTitle(selectedProject.title); setNewDesc(selectedProject.description || ""); setShowProjectModal(true); }}>Edit Project</button>
          <button onClick={openAddTask}>+ Add Task</button>
        </div>

        <div style={panel}>
          <h3 style={{ marginTop: 0 }}>Tasks</h3>
          {tasks.length ? (
            <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
              {tasks.map(t => (
                <li key={t._id} style={{ display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <b>{t.title}</b>
                    <span style={chip(t.status === "Done" ? "#9bffba" : t.status === "In Progress" ? "#ffd29b" : "#c7d2fe")}>{t.status}</span>
                  </div>
                  {t.description ? <p style={{ margin: 0, color: "#a3a3a3" }}>{t.description}</p> : null}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={chip(t.priority === "High" ? "#ffb3b3" : t.priority === "Medium" ? "#ffe066" : "#ffe096")}>{t.priority}</span>
                      <span style={chip(t.assignee ? "#ffe066" : "#e5e7eb")}>{t.assignee ? "Assigned" : "Unassigned"}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => onSelectTask(t._id)}>View</button>
                      <button onClick={() => openEditTask(t)}>Edit</button>
                      <button onClick={() => deleteTask(t._id)}>Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : <p style={{ color: "#a3a3a3" }}>No tasks yet</p>}
        </div>

        {/* Modals in project-selected view */}
        <ProjectModal
          open={showProjectModal}
          onClose={() => { setShowProjectModal(false); setEditingProject(null); }}
          isEditing={!!editingProject}
          title={newTitle}
          setTitle={setNewTitle}
          desc={newDesc}
          setDesc={setNewDesc}
          onSubmit={editingProject ? submitEditProject : addProject}
        />
        <TaskModal
          open={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          isEditing={!!editingTask}
          taskForm={taskForm}
          setTaskForm={setTaskForm}
          onSubmit={editingTask ? submitEditTask : submitAddTask}
          users={users}
        />
      </div>
    );
  }

  // Projects list + Add Project Form
  return (
    <div>
      <h2 style={{ marginBottom: 8 }}>Projects</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => { setEditingProject(null); setNewTitle(""); setNewDesc(""); setShowProjectModal(true); }}>+ New Project</button>
      </div>

      <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        {projects.map(p => (
          <li key={p._id} style={{ display: "grid", gap: 8 }}>
            <b>{p.title}</b>
            {p.description ? <p style={{ margin: 0, color: "#a3a3a3" }}>{p.description}</p> : null}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => loadTasks(p)}>View</button>
              <button onClick={() => openEditProject(p)}>Edit</button>
              <button onClick={() => deleteProject(p._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modals in projects list view */}
      <ProjectModal
        open={showProjectModal}
        onClose={() => { setShowProjectModal(false); setEditingProject(null); }}
        isEditing={!!editingProject}
        title={newTitle}
        setTitle={setNewTitle}
        desc={newDesc}
        setDesc={setNewDesc}
        onSubmit={editingProject ? submitEditProject : addProject}
      />
      <TaskModal
        open={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        isEditing={!!editingTask}
        taskForm={taskForm}
        setTaskForm={setTaskForm}
        onSubmit={editingTask ? submitEditTask : submitAddTask}
        users={users}
      />
    </div>
  );
}

// Modals
// Project modal and Task modal rendered at the bottom to avoid conditional return issues
// These will appear regardless of selected view

// Project Modal
export function ProjectModal({ open, onClose, isEditing, title, setTitle, desc, setDesc, onSubmit }) {
  return (
    <Modal open={open} onClose={onClose} title={isEditing ? "Edit Project" : "New Project"}
      actions={(
        <>
          <button onClick={onClose}>Cancel</button>
          <button type="submit" form="project-form">{isEditing ? "Save" : "Create"}</button>
        </>
      )}
    >
      <form id="project-form" onSubmit={onSubmit}>
        <div style={{ display: "grid", gap: 12 }}>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <textarea placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} rows={4} />
        </div>
      </form>
    </Modal>
  );
}

// Task Modal
export function TaskModal({ open, onClose, isEditing, taskForm, setTaskForm, onSubmit, users = [] }) {
  return (
    <Modal open={open} onClose={onClose} title={isEditing ? "Edit Task" : "+ New Task"}
      actions={(
        <>
          <button onClick={onClose}>Cancel</button>
          <button type="submit" form="task-form">{isEditing ? "Save" : "Create"}</button>
        </>
      )}
    >
      <form id="task-form" onSubmit={onSubmit}>
        <div style={{ display: "grid", gap: 12 }}>
          <input placeholder="Title" value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} required />
          <textarea placeholder="Description" rows={4} value={taskForm.description}
            onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label>Status</label>
              <select value={taskForm.status} onChange={e => setTaskForm({ ...taskForm, status: e.target.value })}>
                <option>Todo</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>
            <div>
              <label>Priority</label>
              <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>
          <div>
            <label>Assignee</label>
            <select value={taskForm.assignee || ""} onChange={e => setTaskForm({ ...taskForm, assignee: e.target.value || null })}>
              <option value="">Unassigned</option>
              {(Array.isArray(users) ? users : []).map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
}

// Attach the modals to the module by augmenting default export usage below
