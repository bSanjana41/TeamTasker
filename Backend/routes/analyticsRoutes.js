import { Router } from "express";
import { tasksPerDay, topCompleters, statusCounts } from "../controllers/analyticsController.js";

const router = Router();

router.get("/tasks-per-day", tasksPerDay);
router.get("/top-completers", topCompleters);
router.get("/status-counts", statusCounts);

export default router;


