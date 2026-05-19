import { Types, type FilterQuery } from "mongoose";
import { LeadModel, type Lead } from "../models/lead.model.js";
import type { UserRole } from "../models/user.model.js";
import type { CreateLeadInput, LeadQueryInput, UpdateLeadInput } from "../utils/validation.js";

const PAGE_LIMIT = 10;

export interface Actor {
  id: string;
  role: UserRole;
}

export interface LeadDto {
  id: string;
  name: string;
  email: string;
  status: Lead["status"];
  source: Lead["source"];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationResult {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  limit: 10;
}

interface LeadLeanRecord {
  _id: Types.ObjectId;
  name: string;
  email: string;
  status: Lead["status"];
  source: Lead["source"];
  ownerId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const ownerScope = (actor: Actor): FilterQuery<Lead> =>
  actor.role === "Admin" ? {} : { ownerId: new Types.ObjectId(actor.id) };

export const buildLeadQuery = (query: LeadQueryInput, actor: Actor): FilterQuery<Lead> => {
  const filter: FilterQuery<Lead> = {
    ...ownerScope(actor)
  };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.source) {
    filter.source = query.source;
  }

  if (query.search) {
    const searchExpression = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ name: searchExpression }, { email: searchExpression }];
  }

  return filter;
};

const toLeadDto = (lead: LeadLeanRecord): LeadDto => ({
  id: lead._id.toString(),
  name: lead.name,
  email: lead.email,
  status: lead.status,
  source: lead.source,
  ownerId: lead.ownerId.toString(),
  createdAt: lead.createdAt.toISOString(),
  updatedAt: lead.updatedAt.toISOString()
});

export const leadService = {
  async create(input: CreateLeadInput, actor: Actor): Promise<LeadDto> {
    const lead = await LeadModel.create({
      ...input,
      ownerId: new Types.ObjectId(actor.id)
    });

    return toLeadDto({
      _id: lead._id as Types.ObjectId,
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
      ownerId: lead.ownerId,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt
    });
  },

  async list(query: LeadQueryInput, actor: Actor): Promise<{ leads: LeadDto[]; pagination: PaginationResult }> {
    const filter = buildLeadQuery(query, actor);
    const currentPage = query.page;
    const skip = (currentPage - 1) * PAGE_LIMIT;
    const sortDirection = query.sort === "Oldest" ? 1 : -1;

    const [records, totalRecords] = await Promise.all([
      LeadModel.find(filter).sort({ createdAt: sortDirection }).skip(skip).limit(PAGE_LIMIT).lean<LeadLeanRecord[]>(),
      LeadModel.countDocuments(filter)
    ]);

    return {
      leads: records.map(toLeadDto),
      pagination: {
        totalRecords,
        currentPage,
        totalPages: Math.max(Math.ceil(totalRecords / PAGE_LIMIT), 1),
        limit: PAGE_LIMIT
      }
    };
  },

  async listForExport(query: LeadQueryInput, actor: Actor): Promise<LeadDto[]> {
    const filter = buildLeadQuery(query, actor);
    const sortDirection = query.sort === "Oldest" ? 1 : -1;
    const records = await LeadModel.find(filter).sort({ createdAt: sortDirection }).lean<LeadLeanRecord[]>();
    return records.map(toLeadDto);
  },

  async findById(id: string, actor: Actor): Promise<LeadDto | null> {
    const record = await LeadModel.findOne({
      _id: id,
      ...ownerScope(actor)
    }).lean<LeadLeanRecord>();

    return record ? toLeadDto(record) : null;
  },

  async updateById(id: string, input: UpdateLeadInput, actor: Actor): Promise<LeadDto | null> {
    const record = await LeadModel.findOneAndUpdate(
      {
        _id: id,
        ...ownerScope(actor)
      },
      input,
      {
        new: true,
        runValidators: true
      }
    ).lean<LeadLeanRecord>();

    return record ? toLeadDto(record) : null;
  },

  async deleteById(id: string): Promise<LeadDto | null> {
    const record = await LeadModel.findByIdAndDelete(id).lean<LeadLeanRecord>();
    return record ? toLeadDto(record) : null;
  }
};
