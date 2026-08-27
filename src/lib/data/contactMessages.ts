import { queryAll, queryOne, execute, type Row } from "@/lib/db";
import { genId } from "@/lib/ids";
import { toBool, toFlag } from "./util";
import type { ContactMessage } from "./types";

function mapRow(row: Row): ContactMessage {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: (row.phone as string | null) ?? null,
    subject: (row.subject as string | null) ?? null,
    message: row.message as string,
    isRead: toBool(row.isRead),
    createdAt: row.createdAt as string,
  };
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  const rows = await queryAll(`SELECT * FROM contactMessages ORDER BY createdAt DESC`);
  return rows.map(mapRow);
}

export async function countUnreadMessages(): Promise<number> {
  const row = await queryOne(`SELECT COUNT(*) as count FROM contactMessages WHERE isRead = 0`);
  return Number(row?.count ?? 0);
}

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}

export async function createContactMessage(input: ContactMessageInput): Promise<ContactMessage> {
  const id = genId();
  await execute(
    `INSERT INTO contactMessages (id, name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, input.name, input.email, input.phone ?? null, input.subject ?? null, input.message],
  );
  const row = await queryOne(`SELECT * FROM contactMessages WHERE id = ?`, [id]);
  return mapRow(row!);
}

export async function markMessageRead(id: string, isRead: boolean): Promise<void> {
  await execute(`UPDATE contactMessages SET isRead = ? WHERE id = ?`, [toFlag(isRead), id]);
}

export async function deleteContactMessage(id: string): Promise<void> {
  await execute(`DELETE FROM contactMessages WHERE id = ?`, [id]);
}
