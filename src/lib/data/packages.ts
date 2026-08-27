import { queryAll, queryOne, execute, type Row } from "@/lib/db";
import { genId, slugify } from "@/lib/ids";
import { toBool, toFlag } from "./util";
import type { Package } from "./types";

function mapRow(row: Row): Package {
  let features: string[] = [];
  try {
    features = JSON.parse(row.features as string);
  } catch {
    features = [];
  }
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    price: Number(row.price),
    duration: (row.duration as string | null) ?? null,
    description: row.description as string,
    features,
    highlighted: toBool(row.highlighted),
    sortOrder: Number(row.sortOrder),
    active: toBool(row.active),
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  };
}

export async function listPackages(opts: { onlyActive?: boolean } = {}): Promise<Package[]> {
  const rows = opts.onlyActive
    ? await queryAll(`SELECT * FROM packages WHERE active = 1 ORDER BY sortOrder ASC`)
    : await queryAll(`SELECT * FROM packages ORDER BY sortOrder ASC`);
  return rows.map(mapRow);
}

export async function getPackageById(id: string): Promise<Package | null> {
  const row = await queryOne(`SELECT * FROM packages WHERE id = ?`, [id]);
  return row ? mapRow(row) : null;
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  const row = await queryOne(`SELECT * FROM packages WHERE slug = ?`, [slug]);
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

export async function createPackage(input: PackageInput): Promise<Package> {
  const id = genId();
  const slug = slugify(input.name);
  await execute(
    `INSERT INTO packages (id, slug, name, price, duration, description, features, highlighted, sortOrder, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
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
    ],
  );
  return (await getPackageById(id))!;
}

export async function updatePackage(id: string, input: PackageInput): Promise<Package | null> {
  await execute(
    `UPDATE packages SET name = ?, price = ?, duration = ?, description = ?, features = ?, highlighted = ?, sortOrder = ?, active = ?, updatedAt = datetime('now') WHERE id = ?`,
    [
      input.name,
      input.price,
      input.duration ?? null,
      input.description,
      JSON.stringify(input.features),
      toFlag(input.highlighted ?? false),
      input.sortOrder ?? 0,
      toFlag(input.active ?? true),
      id,
    ],
  );
  return getPackageById(id);
}

export async function deletePackage(id: string): Promise<void> {
  await execute(`DELETE FROM packages WHERE id = ?`, [id]);
}
