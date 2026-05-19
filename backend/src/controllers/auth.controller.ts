import bcrypt from "bcryptjs";
import type { CookieOptions } from "express";
import { Types } from "mongoose";
import { env } from "../config/env.js";
import { UserModel, type UserRole } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { createAuthTokens, hashToken, verifyRefreshToken } from "../utils/jwt.js";
import {
  getValidated,
  type LoginInput,
  type RegisterInput
} from "../utils/validation.js";

interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthResponse {
  user: PublicUser;
  accessToken: string;
}

interface UserAuthRecord {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  refreshTokenHash?: string;
  refreshTokenExpiresAt?: Date;
}

const refreshCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "strict",
  path: "/api/auth/refresh",
  maxAge: env.refreshTokenTtlDays * 24 * 60 * 60 * 1000
});

const toPublicUser = (user: Pick<UserAuthRecord, "_id" | "name" | "email" | "role">): PublicUser => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role
});

const issueSession = async (user: Pick<UserAuthRecord, "_id" | "name" | "email" | "role">): Promise<AuthResponse & { refreshToken: string }> => {
  const tokens = createAuthTokens({
    sub: user._id.toString(),
    role: user.role
  });

  await UserModel.findByIdAndUpdate(user._id, {
    refreshTokenHash: tokens.refreshTokenHash,
    refreshTokenExpiresAt: tokens.refreshTokenExpiresAt
  });

  return {
    user: toPublicUser(user),
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken
  };
};

export const register = asyncHandler(async (_req, res) => {
  const { body } = getValidated<RegisterInput>(res);
  const existingUser = await UserModel.exists({ email: body.email });

  if (existingUser) {
    throw new AppError("A user with this email already exists", 409, "CONFLICT");
  }

  const passwordHash = await bcrypt.hash(body.password, 12);
  const createdUser = await UserModel.create({
    name: body.name,
    email: body.email,
    passwordHash,
    role: body.role
  });
  const session = await issueSession({
    _id: createdUser._id as Types.ObjectId,
    name: createdUser.name,
    email: createdUser.email,
    role: createdUser.role
  });

  res.cookie(env.cookieName, session.refreshToken, refreshCookieOptions());
  res.status(201).json({
    data: {
      user: session.user,
      accessToken: session.accessToken
    }
  });
});

export const login = asyncHandler(async (_req, res) => {
  const { body } = getValidated<LoginInput>(res);
  const user = await UserModel.findOne({ email: body.email }).select("+passwordHash").lean<UserAuthRecord>();

  if (!user) {
    throw new AppError("Invalid email or password", 401, "UNAUTHORIZED");
  }

  const isPasswordValid = await bcrypt.compare(body.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401, "UNAUTHORIZED");
  }

  const session = await issueSession(user);
  res.cookie(env.cookieName, session.refreshToken, refreshCookieOptions());
  res.status(200).json({
    data: {
      user: session.user,
      accessToken: session.accessToken
    }
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies as Record<string, unknown>;
  const rawRefreshToken = cookies[env.cookieName];

  if (typeof rawRefreshToken !== "string") {
    throw new AppError("Refresh token is required", 401, "UNAUTHORIZED");
  }

  const payload = verifyRefreshToken(rawRefreshToken);
  const user = await UserModel.findById(payload.sub)
    .select("+refreshTokenHash +refreshTokenExpiresAt")
    .lean<UserAuthRecord>();

  if (!user?.refreshTokenHash || !user.refreshTokenExpiresAt) {
    throw new AppError("Refresh token session is invalid", 401, "UNAUTHORIZED");
  }

  const isExpired = user.refreshTokenExpiresAt.getTime() <= Date.now();
  const tokenMatches = hashToken(rawRefreshToken) === user.refreshTokenHash;

  if (isExpired || !tokenMatches) {
    throw new AppError("Refresh token session has expired", 401, "UNAUTHORIZED");
  }

  const session = await issueSession(user);
  res.cookie(env.cookieName, session.refreshToken, refreshCookieOptions());
  res.status(200).json({
    data: {
      user: session.user,
      accessToken: session.accessToken
    }
  });
});

export const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies as Record<string, unknown>;
  const rawRefreshToken = cookies[env.cookieName];

  if (typeof rawRefreshToken === "string") {
    try {
      const payload = verifyRefreshToken(rawRefreshToken);
      await UserModel.findByIdAndUpdate(payload.sub, {
        $unset: {
          refreshTokenHash: "",
          refreshTokenExpiresAt: ""
        }
      });
    } catch {
      // A malformed refresh token should still result in a cleared cookie.
    }
  }

  res.clearCookie(env.cookieName, {
    ...refreshCookieOptions(),
    maxAge: undefined
  });
  res.status(204).send();
});

export const me = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401, "UNAUTHORIZED");
  }

  res.status(200).json({
    data: {
      user: req.user
    }
  });
});
