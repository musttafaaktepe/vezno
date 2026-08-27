import { db } from "@/lib/db";
import { genId } from "@/lib/ids";
import { toBool, toFlag } from "./util";
import type { ContactMessage } from "./types";

interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: number;
  createdAt: string;
}

function mapRow(row: ContactMessageRow): ContactMessage {
  return { ...row, isRead: toBool(row.isRead) };
}

export function listContactMessages(): ContactMessage[] {
  const rows = db
    .prepare(`SELECT * FROM contactMessages ORDER BY createdAt DESC`)
    .all() as unknown as ContactMessageRow[];
  return rows.map(mapRow);
}

export function countUnreadMessages(): number {
  const { count } = db
    .prepare(`SELECT COUNT(*) as count FROM contactMessages WHERE isRead = 0`)
    .get() as { count: number };
  return count;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}

export function createContactMessage(input: ContactMessageInput): ContactMessage {
  const id = genId();
  db.prepare(
    `INSERT INTO contactMessages (id, name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(id, input.name, input.email, input.phone ?? null, input.subject ?? null, input.message);
  const row = db.prepare(`SELECT * FROM contactMessages WHERE id = ?`).get(id) as unknown as ContactMessageRow;
  return mapRow(row);
}

export function markMessageRead(id: string, isRead: boolean): void {
  db.prepare(`UPDATE contactMessages SET isRead = ? WHERE id = ?`).run(toFlag(isRead), id);
}

export function deleteContactMessage(id: string): void {
  db.prepare(`DELETE FROM contactMessages WHERE id = ?`).run(id);
}
