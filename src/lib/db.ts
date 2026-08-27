import { createClient, type Client, type InArgs, type InStatement } from "@libsql/client";
import fs from "node:fs";
import path from "node:path";
import { seedStatements } from "./seed";

const SCHEMA_STATEMENTS: string[] = [
  `CREATE TABLE IF NOT EXISTS adminUsers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    name TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    sortOrder INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS packages (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    duration TEXT,
    description TEXT NOT NULL,
    features TEXT NOT NULL DEFAULT '[]',
    highlighted INTEGER NOT NULL DEFAULT 0,
    sortOrder INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS branches (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    workingHours TEXT NOT NULL,
    mapUrl TEXT,
    sortOrder INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    trackingCode TEXT UNIQUE NOT NULL,
    fullName TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    plate TEXT,
    vehicleBrand TEXT,
    vehicleModel TEXT,
    vehicleYear TEXT,
    branchId TEXT NOT NULL REFERENCES branches(id),
    packageId TEXT REFERENCES packages(id),
    serviceType TEXT NOT NULL DEFAULT 'BRANCH',
    appointmentDate TEXT NOT NULL,
    timeSlot TEXT NOT NULL,
    note TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE INDEX IF NOT EXISTS idx_appointments_branch ON appointments(branchId)`,
  `CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status)`,
  `CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointmentDate)`,
  `CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    badge TEXT,
    validUntil TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    sortOrder INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS testimonials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT,
    vehicle TEXT,
    rating INTEGER NOT NULL DEFAULT 5,
    comment TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    sortOrder INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sortOrder INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1
  )`,
  `CREATE TABLE IF NOT EXISTS contactMessages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    isRead INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS siteSettings (
    id TEXT PRIMARY KEY,
    brandName TEXT NOT NULL,
    tagline TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT NOT NULL,
    address TEXT,
    heroTitle TEXT NOT NULL,
    heroSubtitle TEXT NOT NULL,
    aboutText TEXT NOT NULL,
    instagramUrl TEXT,
    facebookUrl TEXT,
    youtubeUrl TEXT,
    workingHours TEXT,
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
];

function createDbClient(): Client {
  if (process.env.VERCEL && !process.env.TURSO_DATABASE_URL) {
    // On Vercel the project directory is read-only, so the local-file
    // fallback below would crash trying to create it — fail with a clear
    // message instead of a confusing mkdir stack trace.
    throw new Error(
      "TURSO_DATABASE_URL tanımlı değil. Vercel projesinde Settings → Environment Variables " +
        "kısmına TURSO_DATABASE_URL ve TURSO_AUTH_TOKEN eklenip yeniden deploy edilmesi gerekiyor.",
    );
  }

  // Falls back to a local libSQL file when no Turso credentials are set, so
  // local development doesn't require a Turso account.
  const url = process.env.TURSO_DATABASE_URL ?? "file:./data/app.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (url.startsWith("file:")) {
    const filePath = url.slice("file:".length);
    fs.mkdirSync(path.dirname(path.resolve(process.cwd(), filePath)), { recursive: true });
  }

  return createClient({ url, authToken });
}

declare global {
  var __appDbClient: Client | undefined;
  var __appDbInit: Promise<void> | undefined;
}

const client = globalThis.__appDbClient ?? (globalThis.__appDbClient = createDbClient());

async function initialize(): Promise<void> {
  for (const statement of SCHEMA_STATEMENTS) {
    await client.execute(statement);
  }

  const { rows } = await client.execute("SELECT COUNT(*) as count FROM services");
  const count = Number(rows[0]?.count ?? 0);
  if (count === 0) {
    try {
      // A single batched transaction: if another cold-starting instance
      // races us and seeds first, our insert of the unique admin email (or
      // any other unique column) fails and the whole batch rolls back —
      // we just swallow that, the data is already there.
      await client.batch(seedStatements(), "write");
    } catch {
      // already seeded by a concurrent instance — nothing to do
    }
  }
}

async function ensureReady(): Promise<void> {
  if (!globalThis.__appDbInit) {
    globalThis.__appDbInit = initialize();
  }
  await globalThis.__appDbInit;
}

export type Row = Record<string, unknown>;

function toRows(rawRows: unknown[], columns: string[]): Row[] {
  return rawRows.map((row) => {
    const arr = row as unknown[];
    const obj: Row = {};
    columns.forEach((col, i) => {
      obj[col] = arr[i];
    });
    return obj;
  });
}

export async function queryAll(sql: string, args: InArgs = []): Promise<Row[]> {
  await ensureReady();
  const result = await client.execute({ sql, args });
  return toRows(result.rows as unknown[], result.columns);
}

export async function queryOne(sql: string, args: InArgs = []): Promise<Row | null> {
  const rows = await queryAll(sql, args);
  return rows[0] ?? null;
}

export async function execute(sql: string, args: InArgs = []): Promise<void> {
  await ensureReady();
  await client.execute({ sql, args });
}

export async function batchWrite(statements: InStatement[]): Promise<void> {
  await ensureReady();
  await client.batch(statements, "write");
}
