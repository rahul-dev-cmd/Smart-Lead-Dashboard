import type { RequestHandler } from "express";
import { UserModel } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate: RequestHandler = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    throw new AppError("Access token is required", 401, "UNAUTHORIZED");
  }

  const payload = verifyAccessToken(token);
  const user = await UserModel.findById(payload.sub).lean();

  if (!user) {
    throw new AppError("Authenticated user no longer exists", 401, "UNAUTHORIZED");
  }

  req.user = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  };

  next();
});
