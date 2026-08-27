import { db } from "@/lib/db";
import { genId, slugify } from "@/lib/ids";
import { toBool, toFlag } from "./util";
import type { Campaign } from "./types";

interface CampaignRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  badge: string | null;
  validUntil: string | null;
  active: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

function mapRow(row: CampaignRow): Campaign {
  return { ...row, active: toBool(row.active) };
}

export function listCampaigns(opts: { onlyActive?: boolean } = {}): Campaign[] {
  const rows = opts.onlyActive
    ? (db
        .prepare(`SELECT * FROM campaigns WHERE active = 1 ORDER BY sortOrder ASC`)
        .all() as unknown as CampaignRow[])
    : (db.prepare(`SELECT * FROM campaigns ORDER BY sortOrder ASC`).all() as unknown as CampaignRow[]);
  return rows.map(mapRow);
}

export function getCampaignById(id: string): Campaign | null {
  const row = db.prepare(`SELECT * FROM campaigns WHERE id = ?`).get(id) as unknown as
    | CampaignRow
    | undefined;
  return row ? mapRow(row) : null;
}

export interface CampaignInput {
  title: string;
  description: string;
  badge?: string | null;
  validUntil?: string | null;
  sortOrder?: number;
  active?: boolean;
}

export function createCampaign(input: CampaignInput): Campaign {
  const id = genId();
  const slug = slugify(input.title);
  db.prepare(
    `INSERT INTO campaigns (id, slug, title, description, badge, validUntil, sortOrder, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    slug,
    input.title,
    input.description,
    input.badge ?? null,
    input.validUntil ?? null,
    input.sortOrder ?? 0,
    toFlag(input.active ?? true),
  );
  return getCampaignById(id)!;
}

export function updateCampaign(id: string, input: CampaignInput): Campaign | null {
  db.prepare(
    `UPDATE campaigns SET title = ?, description = ?, badge = ?, validUntil = ?, sortOrder = ?, active = ?, updatedAt = datetime('now') WHERE id = ?`,
  ).run(
    input.title,
    input.description,
    input.badge ?? null,
    input.validUntil ?? null,
    input.sortOrder ?? 0,
    toFlag(input.active ?? true),
    id,
  );
  return getCampaignById(id);
}

export function deleteCampaign(id: string): void {
  db.prepare(`DELETE FROM campaigns WHERE id = ?`).run(id);
}
