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
import { optionalAuth, requireAuth } from "../middlewares/auth.middleware.js";
import { createDownloadSchema, listDownloadsSchema } from "../validations/download.validation.js";
import { createDownload, listDownloads } from "../controllers/download.controller.js";

const router = Router();

//READ
router.get("/", optionalAuth, validate(listProjectsSchema), listProjects);
router.get("/:slug", optionalAuth, validate(getProjectBySlugSchema), getProjectBySlug);

//MANIPULATE
router.post("/", requireAuth, requireRole("ADMIN", "HELPER"), validate(createProjectSchema), createProject);
router.patch("/:id", requireAuth, requireRole("ADMIN", "HELPER"), validate(updateProjectSchema), updateProject);
router.delete("/:id", requireAuth, requireRole("ADMIN"), validate(deleteProjectSchema), deleteProject);

//DOWNLOAD
router.post("/:id/downloads", requireAuth, requireRole("ADMIN", "HELPER"), validate(createDownloadSchema), createDownload);
router.get("/:id/downloads", validate(listDownloadsSchema), listDownloads);

export default router;