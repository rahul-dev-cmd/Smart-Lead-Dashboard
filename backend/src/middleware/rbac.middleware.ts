import type { RequestHandler } from "express";
import type { UserRole } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";

export const requireRoles =
  (...allowedRoles: UserRole[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) {
      next(new AppError("Authentication required", 401, "UNAUTHORIZED"));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError("Insufficient role privileges", 403, "FORBIDDEN"));
      return;
    }

    next();
  };
