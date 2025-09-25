import * as taskService from "../services/taskService.js";
export const createTask = async (req, res) => {
  try {
    console.log("=== CREATE TASK CONTROLLER ===");
    console.log("📦 Full request body:", JSON.stringify(req.body, null, 2));
    
    // Enhanced validation
    const { title, project } = req.body;
    
    console.log("📝 Raw title:", title);
    console.log("📝 Type of title:", typeof title);
    console.log("🏗️ Raw project:", project);
    console.log("🏗️ Type of project:", typeof project);
    
    if (!title) {
      console.log("❌ Title is missing");
      return res.status(400).json({ error: "Title is required" });
    }
    
    if (typeof title !== 'string') {
      console.log("❌ Title is not a string");
      return res.status(400).json({ error: "Title must be a string" });
    }
    
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      console.log("❌ Title is empty after trimming");
      return res.status(400).json({ error: "Title cannot be empty" });
    }
    
    if (!project) {
      console.log("❌ Project is missing");
      return res.status(400).json({ error: "Project ID is required" });
    }

    console.log("✅ Validation passed");
    console.log("👤 User:", req.user);
    
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(400).json({ error: "User ID not found" });
    }

    console.log("🔧 Calling task service...");
    const task = await taskService.createTask(
      { ...req.body, title: trimmedTitle }, // Pass trimmed title
      userId
    );
    
    console.log("✅ Task created successfully");
    res.status(201).json(task);
    
  } catch (err) {
    console.error("❌ Controller error:", err);
    res.status(400).json({ error: err.message });
  }
};

// export const createTask = async (req, res) => {
//   try {
//     console.log("Incoming task data:", req.body);

//     const task = await taskService.createTask(req.body);
//     res.status(201).json(task);
//   } catch (err) {
//     console.error(" Error creating task:", err.message);
//     res.status(400).json({ error: err.message });
//   }
// };
export const getTasksByProject = async (req, res) => {
  try {
    const tasks = await taskService.getTasksByProject(req.params.projectId);
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.json(task);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, req.user.id);
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req.params.id, req.user.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

