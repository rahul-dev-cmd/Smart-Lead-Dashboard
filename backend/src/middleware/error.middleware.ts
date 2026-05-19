import type { ErrorRequestHandler } from "express";
import jwt from "jsonwebtoken";
const { JsonWebTokenError, TokenExpiredError } = jwt;
import { ZodError } from "zod";
import { AppError } from "../utils/app-error.js";

const isMongoDuplicateError = (error: unknown): error is { code: 11000 } =>
  typeof error === "object" && error !== null && "code" in error && error.code === 11000;

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "BAD_REQUEST",
        message: "Validation failed",
        details: error.flatten().fieldErrors
      }
    });
    return;
  }

  if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
    res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid or expired authentication token"
      }
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    });
    return;
  }

  if (isMongoDuplicateError(error)) {
    res.status(409).json({
      error: {
        code: "CONFLICT",
        message: "A record with this value already exists"
      }
    });
    return;
  }

  console.error("Unhandled application error", error);
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal server error"
    }
  });
};
