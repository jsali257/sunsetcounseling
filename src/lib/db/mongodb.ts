import "server-only";
import { MongoClient, type Db } from "mongodb";
import type {
  AuditEntry,
  InquiryDoc,
  LoginAttempt,
  SessionDoc,
  UserDoc,
} from "./types";

/**
 * One MongoClient per server instance. In development the client is kept on
 * `globalThis` so hot reloads don't open a new connection pool each time.
 */
const globalForMongo = globalThis as unknown as {
  _mongoClient?: Promise<MongoClient>;
  _mongoIndexes?: Promise<void>;
};

export function isDatabaseConfigured() {
  return Boolean(process.env.MONGODB_URI?.trim());
}

function getClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error("MONGODB_URI is not configured.");
  if (!globalForMongo._mongoClient) {
    globalForMongo._mongoClient = new MongoClient(uri, {
      appName: "sunset-counseling-website",
      maxPoolSize: 10,
    })
      .connect()
      .catch((error) => {
        // Allow a later request to retry instead of caching the failure.
        globalForMongo._mongoClient = undefined;
        throw error;
      });
  }
  return globalForMongo._mongoClient;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  const db = client.db(process.env.MONGODB_DB?.trim() || "sunset_counseling");
  globalForMongo._mongoIndexes ??= ensureIndexes(db).catch((error) => {
    globalForMongo._mongoIndexes = undefined;
    throw error;
  });
  await globalForMongo._mongoIndexes;
  return db;
}

export async function collections() {
  const db = await getDb();
  return {
    users: db.collection<UserDoc>("users"),
    sessions: db.collection<SessionDoc>("sessions"),
    inquiries: db.collection<InquiryDoc>("inquiries"),
    audit: db.collection<AuditEntry>("audit_log"),
    loginAttempts: db.collection<LoginAttempt>("login_attempts"),
  };
}

async function ensureIndexes(db: Db) {
  await Promise.all([
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("sessions").createIndex({ tokenHash: 1 }, { unique: true }),
    db.collection("sessions").createIndex({ userId: 1 }),
    // MongoDB removes expired sessions and login attempts automatically.
    db.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection("login_attempts").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection("login_attempts").createIndex({ email: 1, createdAt: -1 }),
    db.collection("login_attempts").createIndex({ ip: 1, createdAt: -1 }),
    db.collection("inquiries").createIndex({ createdAt: -1 }),
    db.collection("inquiries").createIndex({ status: 1, createdAt: -1 }),
    db.collection("audit_log").createIndex({ at: -1 }),
  ]);
}
