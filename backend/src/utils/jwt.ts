import crypto from "node:crypto";
import jwt from "jsonwebtoken";
type SignOptions = jwt.SignOptions;
import { env } from "../config/env.js";
import type { UserRole } from "../models/user.model.js";

interface TokenPayload {
  sub: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenHash: string;
  refreshTokenExpiresAt: Date;
}

const sign = (payload: TokenPayload, secret: string, expiresIn: SignOptions["expiresIn"]): string =>
  jwt.sign(payload, secret, {
    expiresIn,
    issuer: "smart-leads-dashboard",
    audience: "smart-leads-users"
  });

export const hashToken = (token: string): string => crypto.createHash("sha256").update(token).digest("hex");

export const createAuthTokens = (payload: TokenPayload): AuthTokens => {
  const refreshTokenExpiresAt = new Date(Date.now() + env.refreshTokenTtlDays * 24 * 60 * 60 * 1000);
  const refreshToken = sign(payload, env.jwtRefreshSecret, `${env.refreshTokenTtlDays}d` as SignOptions["expiresIn"]);

  return {
    accessToken: sign(payload, env.jwtAccessSecret, env.accessTokenTtl as SignOptions["expiresIn"]),
    refreshToken,
    refreshTokenHash: hashToken(refreshToken),
    refreshTokenExpiresAt
  };
};

export const verifyAccessToken = (token: string): TokenPayload =>
  jwt.verify(token, env.jwtAccessSecret, {
    issuer: "smart-leads-dashboard",
    audience: "smart-leads-users"
  }) as TokenPayload;

export const verifyRefreshToken = (token: string): TokenPayload =>
  jwt.verify(token, env.jwtRefreshSecret, {
    issuer: "smart-leads-dashboard",
    audience: "smart-leads-users"
  }) as TokenPayload;
