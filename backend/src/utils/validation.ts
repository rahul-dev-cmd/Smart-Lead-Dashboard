import type { NextFunction, Request, Response } from "express";
import { z, type ZodTypeAny } from "zod";
import { LEAD_SOURCES, LEAD_STATUSES } from "../models/lead.model.js";
import { USER_ROLES } from "../models/user.model.js";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId");

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(128),
  role: z.enum(USER_ROLES).default("Sales User")
});

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1).max(128)
});

export const createLeadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().toLowerCase(),
  status: z.enum(LEAD_STATUSES).default("New"),
  source: z.enum(LEAD_SOURCES)
});

export const updateLeadSchema = createLeadSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one lead field is required"
});

export const leadQuerySchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  source: z.enum(LEAD_SOURCES).optional(),
  search: z.string().trim().max(100).optional().transform((value) => value || undefined),
  sort: z.enum(["Latest", "Oldest"]).default("Latest"),
  page: z.coerce.number().int().min(1).default(1)
});

export const idParamsSchema = z.object({
  id: objectId
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type LeadQueryInput = z.infer<typeof leadQuerySchema>;
export type IdParamsInput = z.infer<typeof idParamsSchema>;

interface RequestSchemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

export interface ValidatedRequest<TBody = unknown, TQuery = unknown, TParams = unknown> {
  body: TBody;
  query: TQuery;
  params: TParams;
}

export const validateRequest =
  (schemas: RequestSchemas) =>
  (req: Request, res: Response, next: NextFunction): void => {
    res.locals.validated = {
      body: schemas.body ? schemas.body.parse(req.body) : req.body,
      query: schemas.query ? schemas.query.parse(req.query) : req.query,
      params: schemas.params ? schemas.params.parse(req.params) : req.params
    };
    next();
  };

export const getValidated = <TBody = unknown, TQuery = unknown, TParams = unknown>(
  res: Response
): ValidatedRequest<TBody, TQuery, TParams> => res.locals.validated as ValidatedRequest<TBody, TQuery, TParams>;
