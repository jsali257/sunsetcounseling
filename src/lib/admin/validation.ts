/** Shared by dashboard forms and server actions. */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const normalizeEmail = (value: FormDataEntryValue | null) =>
  String(value ?? "").trim().toLowerCase().slice(0, 200);

export const normalizeName = (value: FormDataEntryValue | null) =>
  String(value ?? "").trim().replace(/\s+/g, " ").slice(0, 100);
