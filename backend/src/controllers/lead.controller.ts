import { AppError } from "../utils/app-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { toCsv } from "../utils/csv.js";
import {
  getValidated,
  type CreateLeadInput,
  type IdParamsInput,
  type LeadQueryInput,
  type UpdateLeadInput
} from "../utils/validation.js";
import { leadService } from "../services/lead.service.js";

const getActor = (reqUser: Express.Request["user"]) => {
  if (!reqUser) {
    throw new AppError("Authentication required", 401, "UNAUTHORIZED");
  }

  return {
    id: reqUser.id,
    role: reqUser.role
  };
};

export const createLead = asyncHandler(async (req, res) => {
  const { body } = getValidated<CreateLeadInput>(res);
  const lead = await leadService.create(body, getActor(req.user));
  res.status(201).json({ data: lead });
});

export const listLeads = asyncHandler(async (req, res) => {
  const { query } = getValidated<unknown, LeadQueryInput>(res);
  const result = await leadService.list(query, getActor(req.user));
  res.status(200).json({
    data: result.leads,
    pagination: result.pagination
  });
});

export const exportLeads = asyncHandler(async (req, res) => {
  const { query } = getValidated<unknown, LeadQueryInput>(res);
  const leads = await leadService.listForExport(query, getActor(req.user));
  const csv = toCsv(
    ["Name", "Email", "Status", "Source", "Created At"],
    leads.map((lead) => [lead.name, lead.email, lead.status, lead.source, lead.createdAt])
  );

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=smart-leads.csv");
  res.status(200).send(csv);
});

export const getLead = asyncHandler(async (req, res) => {
  const { params } = getValidated<unknown, unknown, IdParamsInput>(res);
  const lead = await leadService.findById(params.id, getActor(req.user));

  if (!lead) {
    throw new AppError("Lead not found", 404, "NOT_FOUND");
  }

  res.status(200).json({ data: lead });
});

export const updateLead = asyncHandler(async (req, res) => {
  const { body, params } = getValidated<UpdateLeadInput, unknown, IdParamsInput>(res);
  const lead = await leadService.updateById(params.id, body, getActor(req.user));

  if (!lead) {
    throw new AppError("Lead not found", 404, "NOT_FOUND");
  }

  res.status(200).json({ data: lead });
});

export const deleteLead = asyncHandler(async (_req, res) => {
  const { params } = getValidated<unknown, unknown, IdParamsInput>(res);
  const lead = await leadService.deleteById(params.id);

  if (!lead) {
    throw new AppError("Lead not found", 404, "NOT_FOUND");
  }

  res.status(200).json({ data: lead });
});
