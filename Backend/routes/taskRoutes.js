import { Router } from "express";
import { createTask, deleteTask, getTasksByProject, updateTask, getTaskById, assignedTasks } from "../controllers/taskController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router= Router()
router.use(verifyJWT);

//protected
router.post("/", createTask);
router.get("/project/:projectId", getTasksByProject);
router.get("/assigned",assignedTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);


export default router;