import { Router } from "express";
import { getCurrentUser, login, logout, signup } from "../controllers/authController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";



const router =Router()

//public
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.get("/me",verifyJWT,getCurrentUser)

export default router
