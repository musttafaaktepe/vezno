import { queryOne, execute, type Row } from "@/lib/db";
import type { AdminUser } from "./types";

function mapRow(row: Row): AdminUser {
  return {
    id: row.id as string,
    email: row.email as string,
    passwordHash: row.passwordHash as string,
    name: row.name as string,
    createdAt: row.createdAt as string,
  };
}

export async function getAdminUserByEmail(email: string): Promise<AdminUser | null> {
  const row = await queryOne(`SELECT * FROM adminUsers WHERE LOWER(email) = LOWER(?)`, [email]);
  return row ? mapRow(row) : null;
}

export async function getAdminUserById(id: string): Promise<AdminUser | null> {
  const row = await queryOne(`SELECT * FROM adminUsers WHERE id = ?`, [id]);
  return row ? mapRow(row) : null;
}

export async function updateAdminPassword(id: string, passwordHash: string): Promise<void> {
  await execute(`UPDATE adminUsers SET passwordHash = ? WHERE id = ?`, [passwordHash, id]);
}
