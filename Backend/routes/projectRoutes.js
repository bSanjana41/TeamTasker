import { Router } from "express";
import { createProject, deleteProject, getProjectById, getProjects, updateProject } from "../Controllers/projectController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router =Router()
router.use(verifyJWT);

//protcted
router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;

