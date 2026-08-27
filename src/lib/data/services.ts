import { db } from "@/lib/db";
import { genId, slugify } from "@/lib/ids";
import { toBool, toFlag } from "./util";
import type { Service } from "./types";

interface ServiceRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  icon: string | null;
  sortOrder: number;
  active: number;
  createdAt: string;
  updatedAt: string;
}

function mapRow(row: ServiceRow): Service {
  return { ...row, active: toBool(row.active) };
}

export function listServices(opts: { onlyActive?: boolean } = {}): Service[] {
  const rows = opts.onlyActive
    ? (db
        .prepare(`SELECT * FROM services WHERE active = 1 ORDER BY sortOrder ASC`)
        .all() as unknown as ServiceRow[])
    : (db.prepare(`SELECT * FROM services ORDER BY sortOrder ASC`).all() as unknown as ServiceRow[]);
  return rows.map(mapRow);
}

export function getServiceById(id: string): Service | null {
  const row = db.prepare(`SELECT * FROM services WHERE id = ?`).get(id) as unknown as
    | ServiceRow
    | undefined;
  return row ? mapRow(row) : null;
}

export function getServiceBySlug(slug: string): Service | null {
  const row = db.prepare(`SELECT * FROM services WHERE slug = ?`).get(slug) as unknown as
    | ServiceRow
    | undefined;
  return row ? mapRow(row) : null;
}

export interface ServiceInput {
  title: string;
  summary: string;
  description: string;
  icon?: string | null;
  sortOrder?: number;
  active?: boolean;
}

export function createService(input: ServiceInput): Service {
  const id = genId();
  const slug = slugify(input.title);
  db.prepare(
    `INSERT INTO services (id, slug, title, summary, description, icon, sortOrder, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    slug,
    input.title,
    input.summary,
    input.description,
    input.icon ?? null,
    input.sortOrder ?? 0,
    toFlag(input.active ?? true),
  );
  return getServiceById(id)!;
}

export function updateService(id: string, input: ServiceInput): Service | null {
  db.prepare(
    `UPDATE services SET title = ?, summary = ?, description = ?, icon = ?, sortOrder = ?, active = ?, updatedAt = datetime('now') WHERE id = ?`,
  ).run(
    input.title,
    input.summary,
    input.description,
    input.icon ?? null,
    input.sortOrder ?? 0,
    toFlag(input.active ?? true),
    id,
  );
  return getServiceById(id);
}

export function deleteService(id: string): void {
  db.prepare(`DELETE FROM services WHERE id = ?`).run(id);
}
