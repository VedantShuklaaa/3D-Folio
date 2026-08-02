import { Router } from "express";
import {
	createTechnology,
	listTechnologies,
	updateTechnology,
	deleteTechnology,
} from "../controllers/technology.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
	createTechnologySchema,
	updateTechnologySchema,
	deleteTechnologySchema,
} from "../validations/technology.validation.js";

const router = Router();

router.get("/", listTechnologies);

router.post("/", requireAuth, requireRole("ADMIN", "HELPER"), validate(createTechnologySchema), createTechnology);
router.patch("/:id", requireAuth, requireRole("ADMIN", "HELPER"), validate(updateTechnologySchema), updateTechnology);
router.delete("/:id", requireAuth, requireRole("ADMIN"), validate(deleteTechnologySchema), deleteTechnology);

export default router;