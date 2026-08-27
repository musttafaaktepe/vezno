import { queryAll, queryOne, execute, type Row } from "@/lib/db";
import { genId } from "@/lib/ids";
import { toBool, toFlag } from "./util";
import type { Testimonial } from "./types";

function mapRow(row: Row): Testimonial {
  return {
    id: row.id as string,
    name: row.name as string,
    city: (row.city as string | null) ?? null,
    vehicle: (row.vehicle as string | null) ?? null,
    rating: Number(row.rating),
    comment: row.comment as string,
    active: toBool(row.active),
    sortOrder: Number(row.sortOrder),
    createdAt: row.createdAt as string,
  };
}

export async function listTestimonials(opts: { onlyActive?: boolean } = {}): Promise<Testimonial[]> {
  const rows = opts.onlyActive
    ? await queryAll(`SELECT * FROM testimonials WHERE active = 1 ORDER BY sortOrder ASC`)
    : await queryAll(`SELECT * FROM testimonials ORDER BY sortOrder ASC`);
  return rows.map(mapRow);
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  const row = await queryOne(`SELECT * FROM testimonials WHERE id = ?`, [id]);
  return row ? mapRow(row) : null;
}

export interface TestimonialInput {
  name: string;
  city?: string | null;
  vehicle?: string | null;
  rating: number;
  comment: string;
  sortOrder?: number;
  active?: boolean;
}

export async function createTestimonial(input: TestimonialInput): Promise<Testimonial> {
  const id = genId();
  await execute(
    `INSERT INTO testimonials (id, name, city, vehicle, rating, comment, sortOrder, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.name,
      input.city ?? null,
      input.vehicle ?? null,
      input.rating,
      input.comment,
      input.sortOrder ?? 0,
      toFlag(input.active ?? true),
    ],
  );
  return (await getTestimonialById(id))!;
}

export async function updateTestimonial(id: string, input: TestimonialInput): Promise<Testimonial | null> {
  await execute(
    `UPDATE testimonials SET name = ?, city = ?, vehicle = ?, rating = ?, comment = ?, sortOrder = ?, active = ? WHERE id = ?`,
    [
      input.name,
      input.city ?? null,
      input.vehicle ?? null,
      input.rating,
      input.comment,
      input.sortOrder ?? 0,
      toFlag(input.active ?? true),
      id,
    ],
  );
  return getTestimonialById(id);
}

export async function deleteTestimonial(id: string): Promise<void> {
  await execute(`DELETE FROM testimonials WHERE id = ?`, [id]);
}
