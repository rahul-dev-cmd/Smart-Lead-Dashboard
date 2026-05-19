import { Schema, Types, model, type HydratedDocument } from "mongoose";

export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_SOURCES = ["Website", "Instagram", "Referral"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export interface Lead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  ownerId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type LeadDocument = HydratedDocument<Lead>;

const leadSchema = new Schema<Lead>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: "New",
      required: true
    },
    source: {
      type: String,
      enum: LEAD_SOURCES,
      required: true
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ status: 1, source: 1, createdAt: -1 });
leadSchema.index({ name: "text", email: "text" });
leadSchema.index({ ownerId: 1, createdAt: -1 });

export const LeadModel = model<Lead>("Lead", leadSchema);
