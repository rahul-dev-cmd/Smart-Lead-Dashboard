import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { z } from "zod";

const currentFile = fileURLToPath(import.meta.url);
const backendRoot = path.resolve(path.dirname(currentFile), "../..");
const repositoryRoot = path.resolve(backendRoot, "..");

dotenv.config({ path: path.resolve(repositoryRoot, ".env") });
dotenv.config({ path: path.resolve(backendRoot, ".env"), override: false });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  CLIENT_URL: z.string().url("CLIENT_URL must be a valid URL"),
  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  ACCESS_TOKEN_TTL: z.string().default("15m"),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(7),
  COOKIE_NAME: z.string().min(1).default("smart_leads_refresh")
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const formatted = parsedEnv.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
  throw new Error(`Invalid environment configuration: ${formatted}`);
}

export const env = {
  nodeEnv: parsedEnv.data.NODE_ENV,
  port: parsedEnv.data.PORT,
  mongoUri: parsedEnv.data.MONGO_URI,
  clientUrl: parsedEnv.data.CLIENT_URL,
  jwtAccessSecret: parsedEnv.data.JWT_ACCESS_SECRET,
  jwtRefreshSecret: parsedEnv.data.JWT_REFRESH_SECRET,
  accessTokenTtl: parsedEnv.data.ACCESS_TOKEN_TTL,
  refreshTokenTtlDays: parsedEnv.data.REFRESH_TOKEN_TTL_DAYS,
  cookieName: parsedEnv.data.COOKIE_NAME,
  isProduction: parsedEnv.data.NODE_ENV === "production"
} as const;
