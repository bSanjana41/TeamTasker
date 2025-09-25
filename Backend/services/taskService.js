import Task from "../models/taskSchema.js";
import ActivityLog from "../models/activityLogSchema.js";
import Notification from "../models/notificationSchema.js";

export const createTask = async (data) => {

  // Create task
  const task = new Task({
    title: data.title,
    project: data.project,
    description: data.description || "",
    status: data.status || "Todo",
    priority: data.priority || "Medium",
    assignee: data.assignee || null,
    dueDate: data.dueDate || null,
  });

  await task.save();

    // Notify initial assignee
  if (task.assignee) {
    await Notification.create({
      user: task.assignee,
      task: task._id,
      type: "assigned",
      text: `You have been assigned to task "${task.title}"`
    });
  }

  return task;
};

export const getTasksByProject = (projectId) => Task.find({ project: projectId });

export const updateTask = async (taskId, updates, userId) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");

  const oldAssignee = task.assignee?.toString();
if (updates.assignee === "" || updates.assignee === null) {
    delete updates.assignee;
  }


  Object.assign(task, updates);
  if (updates.status && updates.status === "Done" && !task.completedAt) {
    task.completedAt = new Date();
  }
  await task.save();

  await ActivityLog.create({
    user: userId,
    action: "task_updated",
    metadata: { taskId }
  });
//new assignee notification
  if (updates.assignee && updates.assignee.toString() !== oldAssignee) {
    await Notification.create({
      user: updates.assignee,
      task: task._id,
      type: "assigned",
      text: `You have been assigned to task "${task.title}"`
    });
  }
//update notification
if (task.assignee && task.assignee.toString() !== userId) {
  await Notification.create({
    user: task.assignee,
    task: task._id,
    type: "updated",
    text: `Task "${task.title}" has been updated`
  });
}

  return task;
};

export const getTaskById = async (taskId) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");
  return task;
};

export const deleteTask = async (taskId, userId) => {
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) throw new Error("Task not found");

  await ActivityLog.create({
    user: userId,
    action: "task_deleted",
    metadata: { taskId }
  });

  return task;
};

export const getTasksAssignedToUser = async (userId) => {
  return Task.find({ assignee: userId })
    .populate("assignee", "name email") 
    .populate("project", "title");      
};
