import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import projectRoutes from "./project.routes.js";
import categoryRoutes from "./category.routes.js";
import technologyRoutes from "./technology.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/categories", categoryRoutes);
router.use("/technologies", technologyRoutes);

export default router;