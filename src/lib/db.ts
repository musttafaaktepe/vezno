import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { seedDatabase } from "./seed";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "app.db");
const LOCK_PATH = path.join(DATA_DIR, ".init.lock");

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS adminUsers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  name TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS services (
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
);

CREATE TABLE IF NOT EXISTS packages (
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
);

CREATE TABLE IF NOT EXISTS branches (
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
);

CREATE TABLE IF NOT EXISTS appointments (
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
);

CREATE INDEX IF NOT EXISTS idx_appointments_branch ON appointments(branchId);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointmentDate);

CREATE TABLE IF NOT EXISTS campaigns (
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
);

CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  vehicle TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  comment TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS contactMessages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  isRead INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS siteSettings (
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
);
`;

function sleepSync(ms: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

// Several processes (e.g. Next's build/dev workers) can import this module
// at nearly the same time on a fresh checkout. Racing to create the SQLite
// file, set its journal mode, and seed it concurrently is unreliable (SQLite
// can report "database is locked" for the very first writes to a brand new
// file even with busy_timeout set). A plain exclusive-create lockfile makes
// only one process run initialization at a time; the rest wait for it to
// finish, then just open the already-initialized database.
function withInitLock<T>(fn: () => T): T {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const start = Date.now();
  let ownLock = false;
  while (!ownLock) {
    try {
      fs.closeSync(fs.openSync(LOCK_PATH, "wx"));
      ownLock = true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      if (Date.now() - start > 10_000) break; // give up waiting, proceed anyway
      sleepSync(50);
    }
  }
  try {
    return fn();
  } finally {
    if (ownLock) {
      try {
        fs.unlinkSync(LOCK_PATH);
      } catch {
        // already removed
      }
    }
  }
}

function createConnection(): DatabaseSync {
  return withInitLock(() => {
    const database = new DatabaseSync(DB_PATH);
    database.exec("PRAGMA busy_timeout = 5000;");
    database.exec("PRAGMA journal_mode = WAL;");
    database.exec("PRAGMA foreign_keys = ON;");
    database.exec(SCHEMA_SQL);

    const { count } = database
      .prepare("SELECT COUNT(*) as count FROM services")
      .get() as { count: number };
    if (count === 0) {
      seedDatabase(database);
    }

    return database;
  });
}

declare global {
  var __appDb: DatabaseSync | undefined;
}

export const db = globalThis.__appDb ?? (globalThis.__appDb = createConnection());
