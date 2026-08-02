import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import projectRoutes from "./project.routes.js";
import categoryRoutes from "./category.routes.js";
import technologyRoutes from "./technology.routes.js";
import uploadRoutes from "./upload.routes.js";
import mediaRoutes from "./media.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/categories", categoryRoutes);
router.use("/technologies", technologyRoutes);
router.use("/uploads", uploadRoutes);
router.use("/media", mediaRoutes);

export default router;