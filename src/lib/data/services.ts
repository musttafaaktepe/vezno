import { queryAll, queryOne, execute, type Row } from "@/lib/db";
import { genId, slugify } from "@/lib/ids";
import { toBool, toFlag } from "./util";
import type { Service } from "./types";

function mapRow(row: Row): Service {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    summary: row.summary as string,
    description: row.description as string,
    icon: (row.icon as string | null) ?? null,
    sortOrder: Number(row.sortOrder),
    active: toBool(row.active),
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  };
}

export async function listServices(opts: { onlyActive?: boolean } = {}): Promise<Service[]> {
  const rows = opts.onlyActive
    ? await queryAll(`SELECT * FROM services WHERE active = 1 ORDER BY sortOrder ASC`)
    : await queryAll(`SELECT * FROM services ORDER BY sortOrder ASC`);
  return rows.map(mapRow);
}

export async function getServiceById(id: string): Promise<Service | null> {
  const row = await queryOne(`SELECT * FROM services WHERE id = ?`, [id]);
  return row ? mapRow(row) : null;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const row = await queryOne(`SELECT * FROM services WHERE slug = ?`, [slug]);
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

export async function createService(input: ServiceInput): Promise<Service> {
  const id = genId();
  const slug = slugify(input.title);
  await execute(
    `INSERT INTO services (id, slug, title, summary, description, icon, sortOrder, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      slug,
      input.title,
      input.summary,
      input.description,
      input.icon ?? null,
      input.sortOrder ?? 0,
      toFlag(input.active ?? true),
    ],
  );
  return (await getServiceById(id))!;
}

export async function updateService(id: string, input: ServiceInput): Promise<Service | null> {
  await execute(
    `UPDATE services SET title = ?, summary = ?, description = ?, icon = ?, sortOrder = ?, active = ?, updatedAt = datetime('now') WHERE id = ?`,
    [
      input.title,
      input.summary,
      input.description,
      input.icon ?? null,
      input.sortOrder ?? 0,
      toFlag(input.active ?? true),
      id,
    ],
  );
  return getServiceById(id);
}

export async function deleteService(id: string): Promise<void> {
  await execute(`DELETE FROM services WHERE id = ?`, [id]);
}
