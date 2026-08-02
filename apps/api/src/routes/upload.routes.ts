import { Router } from "express";
import { presignUpload } from "../controllers/upload.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { presignUploadSchema } from "../validations/upload.validation.js";

const router = Router();

router.post("/presign", requireAuth, requireRole("ADMIN", "HELPER"), validate(presignUploadSchema), presignUpload);

export default router;