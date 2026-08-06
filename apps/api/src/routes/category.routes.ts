import { Router } from "express";
import {
	createCategory,
	listCategories,
	updateCategory,
	deleteCategory,
} from "../controllers/category.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { cacheResponse } from "../middlewares/cache.middleware.js";
import {
	createCategorySchema,
	updateCategorySchema,
	deleteCategorySchema,
} from "../validations/category.validation.js";

const router = Router();

router.get("/", cacheResponse(300), listCategories);

router.post("/", requireAuth, requireRole("ADMIN", "HELPER"), validate(createCategorySchema), createCategory);
router.patch("/:id", requireAuth, requireRole("ADMIN", "HELPER"), validate(updateCategorySchema), updateCategory);
router.delete("/:id", requireAuth, requireRole("ADMIN"), validate(deleteCategorySchema), deleteCategory);

export default router;