/**
 * Creates (or resets) a dashboard administrator.
 *
 *   npm run create-admin -- --email you@example.com --name "Your Name"
 *
 * Reads MONGODB_URI (and optional MONGODB_DB) from .env.local or the environment.
 * Prints a one-time temporary password; the admin chooses their own at first sign-in.
 */
import { createInterface } from "node:readline/promises";
import { parseArgs } from "node:util";
import { MongoClient, ObjectId } from "mongodb";
import { generateTemporaryPassword, hashPassword } from "../src/lib/auth/password.ts";

const { values } = parseArgs({
  options: { email: { type: "string" }, name: { type: "string" } },
});

const uri = process.env.MONGODB_URI?.trim();
if (!uri) {
  console.error("MONGODB_URI is not set. Add it to .env.local or the environment first.");
  process.exit(1);
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
const email = (values.email ?? (await rl.question("Admin email: "))).trim().toLowerCase();
const name = (values.name ?? (await rl.question("Admin name: "))).trim();
rl.close();

if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || !name) {
  console.error("A valid email and a name are required.");
  process.exit(1);
}

const client = new MongoClient(uri);
try {
  await client.connect();
  const users = client.db(process.env.MONGODB_DB?.trim() || "sunset_counseling").collection("users");
  await users.createIndex({ email: 1 }, { unique: true });

  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(temporaryPassword);
  const now = new Date();
  const existing = await users.findOne({ email });

  if (existing) {
    await users.updateOne(
      { _id: existing._id },
      { $set: { name, role: "admin", active: true, passwordHash, mustChangePassword: true, updatedAt: now } },
    );
    await client.db(process.env.MONGODB_DB?.trim() || "sunset_counseling")
      .collection("sessions").deleteMany({ userId: existing._id });
    console.log(`\nExisting account ${email} is now an active administrator with a new temporary password.`);
  } else {
    await users.insertOne({
      _id: new ObjectId(),
      email,
      name,
      role: "admin",
      passwordHash,
      active: true,
      mustChangePassword: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`\nCreated administrator ${name} <${email}>.`);
  }

  console.log(`Temporary password: ${temporaryPassword}`);
  console.log("Sign in at /admin/login — you'll be asked to choose a new password.\n");
} finally {
  await client.close();
}
