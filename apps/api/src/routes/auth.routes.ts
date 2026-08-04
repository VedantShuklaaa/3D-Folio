import { Router } from "express";
import { googleLogin, googleCallback, logout, getMe } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.post("/logout", logout);
router.get("/me", requireAuth, getMe);

export default router;