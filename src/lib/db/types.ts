import type { ObjectId } from "mongodb";

export const roles = ["admin", "staff"] as const;
export type Role = (typeof roles)[number];

export const roleLabels: Record<Role, string> = {
  admin: "Administrator",
  staff: "Staff",
};

export type UserDoc = {
  _id: ObjectId;
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
  active: boolean;
  /** Set when an admin issues a temporary password. */
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
};

export type SessionDoc = {
  _id: ObjectId;
  /** SHA-256 of the cookie token — the raw token is never stored. */
  tokenHash: string;
  userId: ObjectId;
  createdAt: Date;
  expiresAt: Date;
  userAgent?: string;
};

export type LoginAttempt = {
  _id?: ObjectId;
  email: string;
  ip: string;
  createdAt: Date;
  expiresAt: Date;
};

export const inquiryStatuses = ["new", "contacted", "scheduled", "closed"] as const;
export type InquiryStatus = (typeof inquiryStatuses)[number];

export const statusLabels: Record<InquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  scheduled: "Scheduled",
  closed: "Closed",
};

export type InquiryNote = {
  id: string;
  body: string;
  authorId: ObjectId;
  authorName: string;
  createdAt: Date;
};

export type InquiryEvent = {
  at: Date;
  byId: ObjectId;
  byName: string;
  from: InquiryStatus;
  to: InquiryStatus;
};

export type InquiryDoc = {
  _id: ObjectId;
  reason: string;
  name: string;
  phone: string;
  email: string;
  contactMethod: string;
  format: string;
  language: string;
  message: string;
  status: InquiryStatus;
  notes: InquiryNote[];
  history: InquiryEvent[];
  createdAt: Date;
  updatedAt: Date;
  /** First time the status moved away from "new" — used for response-time stats. */
  firstRespondedAt?: Date;
};

export type AuditEntry = {
  _id?: ObjectId;
  at: Date;
  actorId?: ObjectId;
  actorName: string;
  action: string;
  targetType?: "user" | "inquiry" | "export";
  targetId?: string;
  detail?: string;
};
