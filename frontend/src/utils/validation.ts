import { z } from "zod";
import { LEAD_SOURCES, LEAD_STATUSES, USER_ROLES } from "../types";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").toLowerCase(),
  password: z.string().min(1, "Password is required")
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Enter a valid email address").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  role: z.enum(USER_ROLES)
});

export const leadFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Enter a valid email address").toLowerCase(),
  status: z.enum(LEAD_STATUSES),
  source: z.enum(LEAD_SOURCES)
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LeadFormSchemaValues = z.infer<typeof leadFormSchema>;
