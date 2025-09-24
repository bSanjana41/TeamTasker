import {Router} from "express";
import { getNotifications, markRead } from "../controllers/notificationController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getNotifications);
router.put("/:id/read", markRead);

export default router;
