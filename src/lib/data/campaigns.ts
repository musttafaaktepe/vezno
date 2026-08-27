import { queryAll, queryOne, execute, type Row } from "@/lib/db";
import { genId, slugify } from "@/lib/ids";
import { toBool, toFlag } from "./util";
import type { Campaign } from "./types";

function mapRow(row: Row): Campaign {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    description: row.description as string,
    badge: (row.badge as string | null) ?? null,
    validUntil: (row.validUntil as string | null) ?? null,
    active: toBool(row.active),
    sortOrder: Number(row.sortOrder),
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  };
}

export async function listCampaigns(opts: { onlyActive?: boolean } = {}): Promise<Campaign[]> {
  const rows = opts.onlyActive
    ? await queryAll(`SELECT * FROM campaigns WHERE active = 1 ORDER BY sortOrder ASC`)
    : await queryAll(`SELECT * FROM campaigns ORDER BY sortOrder ASC`);
  return rows.map(mapRow);
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  const row = await queryOne(`SELECT * FROM campaigns WHERE id = ?`, [id]);
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

export async function createCampaign(input: CampaignInput): Promise<Campaign> {
  const id = genId();
  const slug = slugify(input.title);
  await execute(
    `INSERT INTO campaigns (id, slug, title, description, badge, validUntil, sortOrder, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      slug,
      input.title,
      input.description,
      input.badge ?? null,
      input.validUntil ?? null,
      input.sortOrder ?? 0,
      toFlag(input.active ?? true),
    ],
  );
  return (await getCampaignById(id))!;
}

export async function updateCampaign(id: string, input: CampaignInput): Promise<Campaign | null> {
  await execute(
    `UPDATE campaigns SET title = ?, description = ?, badge = ?, validUntil = ?, sortOrder = ?, active = ?, updatedAt = datetime('now') WHERE id = ?`,
    [
      input.title,
      input.description,
      input.badge ?? null,
      input.validUntil ?? null,
      input.sortOrder ?? 0,
      toFlag(input.active ?? true),
      id,
    ],
  );
  return getCampaignById(id);
}

export async function deleteCampaign(id: string): Promise<void> {
  await execute(`DELETE FROM campaigns WHERE id = ?`, [id]);
}
