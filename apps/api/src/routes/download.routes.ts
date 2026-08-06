import { Router } from "express";
import { deleteDownload, getDownloadUrl } from "../controllers/download.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { deleteDownloadSchema } from "../validations/download.validation.js";
import { cacheResponse } from "../middlewares/cache.middleware.js";

const router = Router();

router.get("/:id/url", cacheResponse(300), getDownloadUrl);
router.delete("/:id", requireAuth, requireRole("ADMIN", "HELPER"), validate(deleteDownloadSchema), deleteDownload);

export default router;