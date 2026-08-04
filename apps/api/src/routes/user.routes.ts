import { Router } from "express";
import { searchUsers, updateUserRole, updateUserActive } from "../controllers/user.controller.js";
import { getMe } from "../controllers/auth.controller.js";
import { searchUsersSchema, updateRoleSchema, updateActiveSchema } from "../validations/user.validation.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

router.get("/me", requireAuth, getMe);
router.get("/search", requireAuth, requireRole("ADMIN"), validate(searchUsersSchema), searchUsers);
router.patch("/:id/role", requireAuth, requireRole("ADMIN"), validate(updateRoleSchema), updateUserRole);
router.patch("/:id/active", requireAuth, requireRole("ADMIN"), validate(updateActiveSchema), updateUserActive);

export default router;