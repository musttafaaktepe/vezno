import { queryAll, queryOne, execute, type Row } from "@/lib/db";
import { genId, slugify } from "@/lib/ids";
import { toBool, toFlag } from "./util";
import type { Branch } from "./types";

function mapRow(row: Row): Branch {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    city: row.city as string,
    district: (row.district as string | null) ?? null,
    address: row.address as string,
    phone: row.phone as string,
    workingHours: row.workingHours as string,
    mapUrl: (row.mapUrl as string | null) ?? null,
    sortOrder: Number(row.sortOrder),
    active: toBool(row.active),
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  };
}

export async function listBranches(opts: { onlyActive?: boolean } = {}): Promise<Branch[]> {
  const rows = opts.onlyActive
    ? await queryAll(`SELECT * FROM branches WHERE active = 1 ORDER BY sortOrder ASC`)
    : await queryAll(`SELECT * FROM branches ORDER BY sortOrder ASC`);
  return rows.map(mapRow);
}

export async function getBranchById(id: string): Promise<Branch | null> {
  const row = await queryOne(`SELECT * FROM branches WHERE id = ?`, [id]);
  return row ? mapRow(row) : null;
}

export async function getBranchBySlug(slug: string): Promise<Branch | null> {
  const row = await queryOne(`SELECT * FROM branches WHERE slug = ?`, [slug]);
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

export async function createBranch(input: BranchInput): Promise<Branch> {
  const id = genId();
  const slug = slugify(input.name);
  const mapUrl =
    input.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(input.address)}`;
  await execute(
    `INSERT INTO branches (id, slug, name, city, district, address, phone, workingHours, mapUrl, sortOrder, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
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
    ],
  );
  return (await getBranchById(id))!;
}

export async function updateBranch(id: string, input: BranchInput): Promise<Branch | null> {
  const mapUrl =
    input.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(input.address)}`;
  await execute(
    `UPDATE branches SET name = ?, city = ?, district = ?, address = ?, phone = ?, workingHours = ?, mapUrl = ?, sortOrder = ?, active = ?, updatedAt = datetime('now') WHERE id = ?`,
    [
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
    ],
  );
  return getBranchById(id);
}

export async function deleteBranch(id: string): Promise<void> {
  await execute(`DELETE FROM branches WHERE id = ?`, [id]);
}
