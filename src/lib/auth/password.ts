/**
 * Password hashing with Node's built-in scrypt (no third-party dependency).
 * Stored format: scrypt$<N>$<r>$<p>$<salt-b64>$<hash-b64>
 *
 * Kept free of Next.js imports so scripts/create-admin.ts can reuse it.
 */
import { randomBytes, scrypt as scryptCb, timingSafeEqual, type ScryptOptions } from "node:crypto";
import { PASSWORD_MIN_LENGTH } from "./password-rules.ts";

const N = 2 ** 15;
const r = 8;
const p = 1;
const KEY_LENGTH = 64;
const MAX_MEM = 64 * 1024 * 1024;

export { PASSWORD_MIN_LENGTH };

function scrypt(password: string, salt: Buffer, keylen: number, options: ScryptOptions) {
  return new Promise<Buffer>((resolve, reject) =>
    scryptCb(password.normalize("NFKC"), salt, keylen, options, (err, key) =>
      err ? reject(err) : resolve(key),
    ),
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, KEY_LENGTH, { N, r, p, maxmem: MAX_MEM });
  return ["scrypt", N, r, p, salt.toString("base64"), key.toString("base64")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, n, rr, pp, saltB64, hashB64] = stored.split("$");
  if (algo !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const key = await scrypt(password, Buffer.from(saltB64, "base64"), expected.length, {
    N: Number(n),
    r: Number(rr),
    p: Number(pp),
    maxmem: MAX_MEM,
  });
  return key.length === expected.length && timingSafeEqual(key, expected);
}

/** Returns an error message, or null when the password is acceptable. */
export function checkPasswordStrength(password: string, email?: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (password.length > 200) return "Use 200 characters or fewer.";
  if (email && password.toLowerCase().includes(email.split("@")[0].toLowerCase())) {
    return "Don’t include your email name in your password.";
  }
  if (new Set(password).size < 5) return "Use a less repetitive password.";
  return null;
}

/** Readable temporary password, e.g. "tide-maple-4821-lark". */
export function generateTemporaryPassword(): string {
  const words = [
    "amber", "birch", "cedar", "dune", "ember", "fern", "grove", "harbor", "iris", "juniper",
    "lark", "maple", "meadow", "olive", "pine", "quill", "river", "sage", "tide", "willow",
  ];
  const pick = () => words[randomBytes(1)[0] % words.length];
  const digits = String(1000 + (randomBytes(2).readUInt16BE(0) % 9000));
  return `${pick()}-${pick()}-${digits}-${pick()}`;
}
