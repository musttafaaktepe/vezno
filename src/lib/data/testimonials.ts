import { db } from "@/lib/db";
import { genId } from "@/lib/ids";
import { toBool, toFlag } from "./util";
import type { Testimonial } from "./types";

interface TestimonialRow {
  id: string;
  name: string;
  city: string | null;
  vehicle: string | null;
  rating: number;
  comment: string;
  active: number;
  sortOrder: number;
  createdAt: string;
}

function mapRow(row: TestimonialRow): Testimonial {
  return { ...row, active: toBool(row.active) };
}

export function listTestimonials(opts: { onlyActive?: boolean } = {}): Testimonial[] {
  const rows = opts.onlyActive
    ? (db
        .prepare(`SELECT * FROM testimonials WHERE active = 1 ORDER BY sortOrder ASC`)
        .all() as unknown as TestimonialRow[])
    : (db
        .prepare(`SELECT * FROM testimonials ORDER BY sortOrder ASC`)
        .all() as unknown as TestimonialRow[]);
  return rows.map(mapRow);
}

export function getTestimonialById(id: string): Testimonial | null {
  const row = db.prepare(`SELECT * FROM testimonials WHERE id = ?`).get(id) as unknown as
    | TestimonialRow
    | undefined;
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

export function createTestimonial(input: TestimonialInput): Testimonial {
  const id = genId();
  db.prepare(
    `INSERT INTO testimonials (id, name, city, vehicle, rating, comment, sortOrder, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.name,
    input.city ?? null,
    input.vehicle ?? null,
    input.rating,
    input.comment,
    input.sortOrder ?? 0,
    toFlag(input.active ?? true),
  );
  return getTestimonialById(id)!;
}

export function updateTestimonial(id: string, input: TestimonialInput): Testimonial | null {
  db.prepare(
    `UPDATE testimonials SET name = ?, city = ?, vehicle = ?, rating = ?, comment = ?, sortOrder = ?, active = ? WHERE id = ?`,
  ).run(
    input.name,
    input.city ?? null,
    input.vehicle ?? null,
    input.rating,
    input.comment,
    input.sortOrder ?? 0,
    toFlag(input.active ?? true),
    id,
  );
  return getTestimonialById(id);
}

export function deleteTestimonial(id: string): void {
  db.prepare(`DELETE FROM testimonials WHERE id = ?`).run(id);
}
