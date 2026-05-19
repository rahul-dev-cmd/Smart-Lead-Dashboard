import { Router } from "express";
import { login, logout, me, refreshToken, register } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import { loginSchema, registerSchema, validateRequest } from "../utils/validation.js";

export const authRouter = Router();

authRouter.post("/register", authRateLimiter, validateRequest({ body: registerSchema }), register);
authRouter.post("/login", authRateLimiter, validateRequest({ body: loginSchema }), login);
authRouter.post("/refresh", authRateLimiter, refreshToken);
authRouter.post("/logout", logout);
authRouter.get("/me", authenticate, me);
