import { queryAll, queryOne, execute, type Row } from "@/lib/db";
import { genId } from "@/lib/ids";
import { toBool, toFlag } from "./util";
import type { Faq } from "./types";

function mapRow(row: Row): Faq {
  return {
    id: row.id as string,
    question: row.question as string,
    answer: row.answer as string,
    sortOrder: Number(row.sortOrder),
    active: toBool(row.active),
  };
}

export async function listFaqs(opts: { onlyActive?: boolean } = {}): Promise<Faq[]> {
  const rows = opts.onlyActive
    ? await queryAll(`SELECT * FROM faqs WHERE active = 1 ORDER BY sortOrder ASC`)
    : await queryAll(`SELECT * FROM faqs ORDER BY sortOrder ASC`);
  return rows.map(mapRow);
}

export async function getFaqById(id: string): Promise<Faq | null> {
  const row = await queryOne(`SELECT * FROM faqs WHERE id = ?`, [id]);
  return row ? mapRow(row) : null;
}

export interface FaqInput {
  question: string;
  answer: string;
  sortOrder?: number;
  active?: boolean;
}

export async function createFaq(input: FaqInput): Promise<Faq> {
  const id = genId();
  await execute(`INSERT INTO faqs (id, question, answer, sortOrder, active) VALUES (?, ?, ?, ?, ?)`, [
    id,
    input.question,
    input.answer,
    input.sortOrder ?? 0,
    toFlag(input.active ?? true),
  ]);
  return (await getFaqById(id))!;
}

export async function updateFaq(id: string, input: FaqInput): Promise<Faq | null> {
  await execute(`UPDATE faqs SET question = ?, answer = ?, sortOrder = ?, active = ? WHERE id = ?`, [
    input.question,
    input.answer,
    input.sortOrder ?? 0,
    toFlag(input.active ?? true),
    id,
  ]);
  return getFaqById(id);
}

export async function deleteFaq(id: string): Promise<void> {
  await execute(`DELETE FROM faqs WHERE id = ?`, [id]);
}
