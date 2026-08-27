import { db } from "@/lib/db";
import { genId, slugify } from "@/lib/ids";
import { toBool, toFlag } from "./util";
import type { Branch } from "./types";

interface BranchRow {
  id: string;
  slug: string;
  name: string;
  city: string;
  district: string | null;
  address: string;
  phone: string;
  workingHours: string;
  mapUrl: string | null;
  sortOrder: number;
  active: number;
  createdAt: string;
  updatedAt: string;
}

function mapRow(row: BranchRow): Branch {
  return { ...row, active: toBool(row.active) };
}

export function listBranches(opts: { onlyActive?: boolean } = {}): Branch[] {
  const rows = opts.onlyActive
    ? (db
        .prepare(`SELECT * FROM branches WHERE active = 1 ORDER BY sortOrder ASC`)
        .all() as unknown as BranchRow[])
    : (db.prepare(`SELECT * FROM branches ORDER BY sortOrder ASC`).all() as unknown as BranchRow[]);
  return rows.map(mapRow);
}

export function getBranchById(id: string): Branch | null {
  const row = db.prepare(`SELECT * FROM branches WHERE id = ?`).get(id) as unknown as
    | BranchRow
    | undefined;
  return row ? mapRow(row) : null;
}

export function getBranchBySlug(slug: string): Branch | null {
  const row = db.prepare(`SELECT * FROM branches WHERE slug = ?`).get(slug) as unknown as
    | BranchRow
    | undefined;
  return row ? mapRow(row) : null;
}

export interface BranchInput {
  name: string;
  city: string;
  district?: string | null;
  address: string;
  phone: string;
  workingHours: string;
  mapUrl?: string | null;
  sortOrder?: number;
  active?: boolean;
}

export function createBranch(input: BranchInput): Branch {
  const id = genId();
  const slug = slugify(input.name);
  const mapUrl = input.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(input.address)}`;
  db.prepare(
    `INSERT INTO branches (id, slug, name, city, district, address, phone, workingHours, mapUrl, sortOrder, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    slug,
    input.name,
    input.city,
    input.district ?? null,
    input.address,
    input.phone,
    input.workingHours,
    mapUrl,
    input.sortOrder ?? 0,
    toFlag(input.active ?? true),
  );
  return getBranchById(id)!;
}

export function updateBranch(id: string, input: BranchInput): Branch | null {
  const mapUrl = input.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(input.address)}`;
  db.prepare(
    `UPDATE branches SET name = ?, city = ?, district = ?, address = ?, phone = ?, workingHours = ?, mapUrl = ?, sortOrder = ?, active = ?, updatedAt = datetime('now') WHERE id = ?`,
  ).run(
    input.name,
    input.city,
    input.district ?? null,
    input.address,
    input.phone,
    input.workingHours,
    mapUrl,
    input.sortOrder ?? 0,
    toFlag(input.active ?? true),
    id,
  );
  return getBranchById(id);
}

export function deleteBranch(id: string): void {
  db.prepare(`DELETE FROM branches WHERE id = ?`).run(id);
}
