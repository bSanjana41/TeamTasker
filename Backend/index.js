import express from 'express';
import cors from 'cors';
import {config} from "dotenv"

import authRoutes from "./routes/authRoutes.js"
import projectRoutes from "./routes/projectRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import { verifyJWT } from './middlewares/authMiddleware.js';
import dbConnect from './config/dbConnect.js';
import cookieParser from 'cookie-parser';



const app = express();
config()
//middleware
app.use(cors({
        origin: "http://localhost:5173",
        methods: ["GET","POST","PUT","DELETE"],
        credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
app.use((req, res, next) => {
  console.log("📦 Incoming Request Body:", req.body);
  console.log("📦 Content-Type:", req.get('Content-Type'));
  console.log("📦 Content-Length:", req.get('Content-Length'));
  next();
});


//routes
// Public routes 
app.use("/api/auth", authRoutes);

// middleware (to protect routes)
app.use(verifyJWT);

// Protected routes
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);

const PORT=process.env.PORT||5000
const startServer = async() => {
    try { 
        await dbConnect();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
        }catch (error) {
            console.error('Error starting server:', error);
            process.exit(1);
        }   
}       
startServer();  

export default app;