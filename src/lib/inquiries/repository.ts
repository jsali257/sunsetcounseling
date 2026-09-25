import "server-only";
import { ObjectId, type Filter } from "mongodb";
import { collections } from "@/lib/db/mongodb";
import {
  inquiryStatuses,
  type InquiryDoc,
  type InquiryStatus,
} from "@/lib/db/types";
import type { Inquiry } from "@/lib/inquiry";

export const PAGE_SIZE = 25;

export function parseObjectId(id: string): ObjectId | null {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id ? new ObjectId(id) : null;
}

export async function createInquiry(inquiry: Inquiry): Promise<ObjectId> {
  const { inquiries } = await collections();
  const now = new Date();
  const _id = new ObjectId();
  await inquiries.insertOne({
    _id,
    ...inquiry,
    status: "new",
    notes: [],
    history: [],
    createdAt: now,
    updatedAt: now,
  });
  return _id;
}

export type InquiryFilters = {
  status?: InquiryStatus;
  reason?: string;
  q?: string;
  page?: number;
};

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function listInquiries(filters: InquiryFilters) {
  const { inquiries } = await collections();
  const query: Filter<InquiryDoc> = {};
  if (filters.status && inquiryStatuses.includes(filters.status)) query.status = filters.status;
  if (filters.reason) query.reason = filters.reason;
  if (filters.q?.trim()) {
    const term = filters.q.trim().slice(0, 100);
    const rx = { $regex: escapeRegex(term), $options: "i" };
    const digits = term.replace(/\D/g, "");
    query.$or = [
      { name: rx },
      { email: rx },
      { phone: rx },
      // Match phone numbers regardless of formatting, e.g. "9565550100" vs "956-555-0100".
      ...(digits.length >= 3
        ? [{ phone: { $regex: digits.split("").join("\\D*") } }]
        : []),
    ];
  }

  const page = Math.max(1, Math.floor(filters.page ?? 1));
  const [items, total] = await Promise.all([
    inquiries
      .find(query, { projection: { notes: 0, history: 0, message: 0 } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .toArray(),
    inquiries.countDocuments(query),
  ]);
  return { items, total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function countByStatus(): Promise<Record<InquiryStatus | "all", number>> {
  const { inquiries } = await collections();
  const rows = await inquiries
    .aggregate<{ _id: InquiryStatus; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }])
    .toArray();
  const counts = { all: 0, new: 0, contacted: 0, scheduled: 0, closed: 0 };
  for (const row of rows) {
    counts[row._id] = row.n;
    counts.all += row.n;
  }
  return counts;
}

export async function getInquiry(id: string) {
  const _id = parseObjectId(id);
  if (!_id) return null;
  const { inquiries } = await collections();
  return inquiries.findOne({ _id });
}

export type InquirySignature = {
  total: number;
  newCount: number;
  /** Changes whenever an inquiry is added, updated, or deleted. */
  version: string;
};

/**
 * A tiny summary of the inquiries collection, polled by the dashboard to
 * detect changes without re-rendering pages when nothing happened.
 */
export async function getInquirySignature(): Promise<InquirySignature> {
  const { inquiries } = await collections();
  const [row] = await inquiries
    .aggregate<{ total: number; newCount: number; lastCreated: Date | null; lastUpdated: Date | null }>([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          newCount: { $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] } },
          lastCreated: { $max: "$createdAt" },
          lastUpdated: { $max: "$updatedAt" },
        },
      },
    ])
    .toArray();
  const total = row?.total ?? 0;
  const newCount = row?.newCount ?? 0;
  return {
    total,
    newCount,
    version: [total, newCount, row?.lastCreated?.getTime() ?? 0, row?.lastUpdated?.getTime() ?? 0].join("-"),
  };
}
