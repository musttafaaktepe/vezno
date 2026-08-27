import { db } from "@/lib/db";
import { genId } from "@/lib/ids";
import { toBool, toFlag } from "./util";
import type { Faq } from "./types";

interface FaqRow {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  active: number;
}

function mapRow(row: FaqRow): Faq {
  return { ...row, active: toBool(row.active) };
}

export function listFaqs(opts: { onlyActive?: boolean } = {}): Faq[] {
  const rows = opts.onlyActive
    ? (db.prepare(`SELECT * FROM faqs WHERE active = 1 ORDER BY sortOrder ASC`).all() as unknown as FaqRow[])
    : (db.prepare(`SELECT * FROM faqs ORDER BY sortOrder ASC`).all() as unknown as FaqRow[]);
  return rows.map(mapRow);
}

export function getFaqById(id: string): Faq | null {
  const row = db.prepare(`SELECT * FROM faqs WHERE id = ?`).get(id) as unknown as FaqRow | undefined;
  return row ? mapRow(row) : null;
}

export interface FaqInput {
  question: string;
  answer: string;
  sortOrder?: number;
  active?: boolean;
}

export function createFaq(input: FaqInput): Faq {
  const id = genId();
  db.prepare(
    `INSERT INTO faqs (id, question, answer, sortOrder, active) VALUES (?, ?, ?, ?, ?)`,
  ).run(id, input.question, input.answer, input.sortOrder ?? 0, toFlag(input.active ?? true));
  return getFaqById(id)!;
}

export function updateFaq(id: string, input: FaqInput): Faq | null {
  db.prepare(
    `UPDATE faqs SET question = ?, answer = ?, sortOrder = ?, active = ? WHERE id = ?`,
  ).run(input.question, input.answer, input.sortOrder ?? 0, toFlag(input.active ?? true), id);
  return getFaqById(id);
}

export function deleteFaq(id: string): void {
  db.prepare(`DELETE FROM faqs WHERE id = ?`).run(id);
}
