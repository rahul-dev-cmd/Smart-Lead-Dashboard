import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { requireRoles } from "../src/middleware/rbac.middleware.js";
import { AppError } from "../src/utils/app-error.js";

const createResponse = (): Response => ({} as Response);

describe("requireRoles", () => {
  it("allows requests with an accepted role", () => {
    const request = {
      user: {
        id: "507f1f77bcf86cd799439011",
        name: "Admin User",
        email: "admin@example.com",
        role: "Admin"
      }
    } satisfies Partial<Request>;
    const next = vi.fn<NextFunction>();

    requireRoles("Admin")(request as Request, createResponse(), next);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });

  it("rejects users without the required role", () => {
    const request = {
      user: {
        id: "507f1f77bcf86cd799439011",
        name: "Sales User",
        email: "sales@example.com",
        role: "Sales User"
      }
    } satisfies Partial<Request>;
    const next = vi.fn<NextFunction>();

    requireRoles("Admin")(request as Request, createResponse(), next);

    const error = next.mock.calls[0]?.[0];
    expect(error).toBeInstanceOf(AppError);
    expect((error as AppError).statusCode).toBe(403);
  });
});
