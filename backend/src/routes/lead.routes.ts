import { Router } from "express";
import { createLead, deleteLead, exportLeads, getLead, listLeads, updateLead } from "../controllers/lead.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/rbac.middleware.js";
import {
  createLeadSchema,
  idParamsSchema,
  leadQuerySchema,
  updateLeadSchema,
  validateRequest
} from "../utils/validation.js";

export const leadRouter = Router();

leadRouter.use(authenticate);

leadRouter.get("/export", validateRequest({ query: leadQuerySchema }), exportLeads);
leadRouter.get("/", validateRequest({ query: leadQuerySchema }), listLeads);
leadRouter.post("/", validateRequest({ body: createLeadSchema }), createLead);
leadRouter.get("/:id", validateRequest({ params: idParamsSchema }), getLead);
leadRouter.patch("/:id", validateRequest({ params: idParamsSchema, body: updateLeadSchema }), updateLead);
leadRouter.delete("/:id", requireRoles("Admin"), validateRequest({ params: idParamsSchema }), deleteLead);
