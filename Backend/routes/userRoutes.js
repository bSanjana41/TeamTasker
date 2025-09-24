import { Router } from "express";
import User from "../models/userSchema.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();
router.use(verifyJWT);

// List users for assignment (basic fields only)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, { name: 1, email: 1 }).lean();
    res.json(users.map(u => ({ id: u._id, name: u.name, email: u.email })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;


