import { db } from "@/lib/db";
import { genId, slugify } from "@/lib/ids";
import { toBool, toFlag } from "./util";
import type { Package } from "./types";

interface PackageRow {
  id: string;
  slug: string;
  name: string;
  price: number;
  duration: string | null;
  description: string;
  features: string;
  highlighted: number;
  sortOrder: number;
  active: number;
  createdAt: string;
  updatedAt: string;
}

function mapRow(row: PackageRow): Package {
  let features: string[] = [];
  try {
    features = JSON.parse(row.features);
  } catch {
    features = [];
  }
  return {
    ...row,
    features,
    highlighted: toBool(row.highlighted),
    active: toBool(row.active),
  };
}

export function listPackages(opts: { onlyActive?: boolean } = {}): Package[] {
  const rows = opts.onlyActive
    ? (db
        .prepare(`SELECT * FROM packages WHERE active = 1 ORDER BY sortOrder ASC`)
        .all() as unknown as PackageRow[])
    : (db.prepare(`SELECT * FROM packages ORDER BY sortOrder ASC`).all() as unknown as PackageRow[]);
  return rows.map(mapRow);
}

export function getPackageById(id: string): Package | null {
  const row = db.prepare(`SELECT * FROM packages WHERE id = ?`).get(id) as unknown as
    | PackageRow
    | undefined;
  return row ? mapRow(row) : null;
}

export function getPackageBySlug(slug: string): Package | null {
  const row = db.prepare(`SELECT * FROM packages WHERE slug = ?`).get(slug) as unknown as
    | PackageRow
    | undefined;
  return row ? mapRow(row) : null;
}

export interface PackageInput {
  name: string;
  price: number;
  duration?: string | null;
  description: string;
  features: string[];
  highlighted?: boolean;
  sortOrder?: number;
  active?: boolean;
}

export function createPackage(input: PackageInput): Package {
  const id = genId();
  const slug = slugify(input.name);
  db.prepare(
    `INSERT INTO packages (id, slug, name, price, duration, description, features, highlighted, sortOrder, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    slug,
    input.name,
    input.price,
    input.duration ?? null,
    input.description,
    JSON.stringify(input.features),
    toFlag(input.highlighted ?? false),
    input.sortOrder ?? 0,
    toFlag(input.active ?? true),
  );
  return getPackageById(id)!;
}

export function updatePackage(id: string, input: PackageInput): Package | null {
  db.prepare(
    `UPDATE packages SET name = ?, price = ?, duration = ?, description = ?, features = ?, highlighted = ?, sortOrder = ?, active = ?, updatedAt = datetime('now') WHERE id = ?`,
  ).run(
    input.name,
    input.price,
    input.duration ?? null,
    input.description,
    JSON.stringify(input.features),
    toFlag(input.highlighted ?? false),
    input.sortOrder ?? 0,
    toFlag(input.active ?? true),
    id,
  );
  return getPackageById(id);
}

export function deletePackage(id: string): void {
  db.prepare(`DELETE FROM packages WHERE id = ?`).run(id);
}
