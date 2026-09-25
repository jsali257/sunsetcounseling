/** Shared by server code and proxy.ts — keep free of Node-only imports. */

// The __Host- prefix requires HTTPS; plain name is used for local development.
export const SESSION_COOKIE =
  process.env.NODE_ENV === "production" ? "__Host-scc_session" : "scc_session";

export const SESSION_TTL_HOURS = 12;

export const LOGIN_PATH = "/admin/login";
