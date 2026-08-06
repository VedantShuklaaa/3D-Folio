import { Router } from "express";
import { createMedia, deleteMedia } from "../controllers/media.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createMediaSchema, deleteMediaSchema } from "../validations/media.validation.js";
import { cacheResponse } from "../middlewares/cache.middleware.js";

const router = Router();

router.post("/", requireAuth, cacheResponse(300), requireRole("ADMIN", "HELPER"), validate(createMediaSchema), createMedia);
router.delete("/:id", requireAuth, requireRole("ADMIN", "HELPER"), validate(deleteMediaSchema), deleteMedia);

export default router;