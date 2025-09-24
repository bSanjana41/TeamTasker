import Project from "../models/projectSchema.js";
import ActivityLog from "../models/ActivityLogSchema.js";

export const createProject = async (data, userId) => {
  const project = new Project({ ...data, owner: userId });
  await project.save();

  await ActivityLog.create({
    user: userId,
    action: "project_created",
    metadata: { projectId: project._id, title: project.title }
  });

  return project;
};

export const getProjects = (userId) => Project.find({ owner: userId });

export const getProjectById = (projectId) => Project.findById(projectId);

export const updateProject = async (projectId, updates, userId) => {
  const project = await Project.findByIdAndUpdate(projectId, updates, { new: true });
  if (!project) throw new Error("Project not found");

  await ActivityLog.create({
    user: userId,
    action: "project_updated",
    metadata: { projectId }
  });

  return project;
};

export const deleteProject = async (projectId, userId) => {
  const project = await Project.findByIdAndDelete(projectId);
  if (!project) throw new Error("Project not found");

  await ActivityLog.create({
    user: userId,
    action: "project_deleted",
    metadata: { projectId }
  });

  return project;
};
