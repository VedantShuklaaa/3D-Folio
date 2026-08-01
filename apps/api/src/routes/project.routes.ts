import { Router } from "express";
import {
	createProject,
	listProjects,
	getProjectBySlug,
	updateProject,
	deleteProject,
} from "../controllers/project.controller.js";
import {
	createProjectSchema,
	updateProjectSchema,
	listProjectsSchema,
	getProjectBySlugSchema,
	deleteProjectSchema,
} from "../validations/project.validation.js";
import { validate } from "../middlewares/validate.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", validate(listProjectsSchema), listProjects);
router.get("/:slug", validate(getProjectBySlugSchema), getProjectBySlug);

router.post("/", requireAuth, requireRole("ADMIN", "HELPER"), validate(createProjectSchema), createProject);
router.patch("/:id", requireAuth, requireRole("ADMIN", "HELPER"), validate(updateProjectSchema), updateProject);
router.delete("/:id", requireAuth, requireRole("ADMIN"), validate(deleteProjectSchema), deleteProject);

export default router;