import {Router} from "express";
import { addComment, getCommentsByTask } from "../controllers/commentController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(verifyJWT);

// Add comment to a task
router.post("/:taskId", addComment);

// Get all comments for a task
router.get("/:taskId", getCommentsByTask);

export default router;
