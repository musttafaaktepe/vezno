import { db } from "@/lib/db";
import type { AdminUser } from "./types";

export function getAdminUserByEmail(email: string): AdminUser | null {
  const row = db
    .prepare(`SELECT * FROM adminUsers WHERE LOWER(email) = LOWER(?)`)
    .get(email) as unknown as AdminUser | undefined;
  return row ?? null;
}

export function getAdminUserById(id: string): AdminUser | null {
  const row = db.prepare(`SELECT * FROM adminUsers WHERE id = ?`).get(id) as unknown as
    | AdminUser
    | undefined;
  return row ?? null;
}

export function updateAdminPassword(id: string, passwordHash: string): void {
  db.prepare(`UPDATE adminUsers SET passwordHash = ? WHERE id = ?`).run(passwordHash, id);
}
