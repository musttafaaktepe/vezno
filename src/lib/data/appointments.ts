import { db } from "@/lib/db";
import { genId, genTrackingCode } from "@/lib/ids";
import { toPlain } from "./util";
import type { Appointment, AppointmentServiceType, AppointmentStatus } from "./types";

type AppointmentRow = Appointment;

export function listAppointments(filters: {
  status?: AppointmentStatus;
  branchId?: string;
  q?: string;
} = {}): Appointment[] {
  const clauses: string[] = [];
  const params: string[] = [];
  if (filters.status) {
    clauses.push("status = ?");
    params.push(filters.status);
  }
  if (filters.branchId) {
    clauses.push("branchId = ?");
    params.push(filters.branchId);
  }
  if (filters.q) {
    clauses.push("(fullName LIKE ? OR phone LIKE ? OR plate LIKE ? OR trackingCode LIKE ?)");
    const like = `%${filters.q}%`;
    params.push(like, like, like, like);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = db
    .prepare(`SELECT * FROM appointments ${where} ORDER BY appointmentDate DESC, timeSlot DESC`)
    .all(...params) as unknown as AppointmentRow[];
  return rows.map(toPlain);
}

export function getAppointmentById(id: string): Appointment | null {
  const row = db.prepare(`SELECT * FROM appointments WHERE id = ?`).get(id) as unknown as
    | AppointmentRow
    | undefined;
  return row ? toPlain(row) : null;
}

export function getAppointmentByTrackingCode(trackingCode: string): Appointment | null {
  const row = db
    .prepare(`SELECT * FROM appointments WHERE UPPER(trackingCode) = UPPER(?)`)
    .get(trackingCode.trim()) as unknown as AppointmentRow | undefined;
  return row ? toPlain(row) : null;
}

export function findAppointmentByTrackingCodeAndPhone(
  trackingCode: string,
  phone: string,
): Appointment | null {
  const normalizedPhone = phone.replace(/\D/g, "");
  const row = db
    .prepare(
      `SELECT * FROM appointments WHERE UPPER(trackingCode) = UPPER(?) AND REPLACE(REPLACE(REPLACE(phone, ' ', ''), '(', ''), ')', '') LIKE '%' || ? || '%'`,
    )
    .get(trackingCode.trim(), normalizedPhone) as unknown as AppointmentRow | undefined;
  return row ? toPlain(row) : null;
}

export interface AppointmentInput {
  fullName: string;
  phone: string;
  email?: string | null;
  plate?: string | null;
  vehicleBrand?: string | null;
  vehicleModel?: string | null;
  vehicleYear?: string | null;
  branchId: string;
  packageId?: string | null;
  serviceType?: AppointmentServiceType;
  appointmentDate: string;
  timeSlot: string;
  note?: string | null;
}

export function createAppointment(input: AppointmentInput): Appointment {
  const id = genId();
  let trackingCode = genTrackingCode();
  while (db.prepare(`SELECT 1 FROM appointments WHERE trackingCode = ?`).get(trackingCode)) {
    trackingCode = genTrackingCode();
  }
  db.prepare(
    `INSERT INTO appointments (id, trackingCode, fullName, phone, email, plate, vehicleBrand, vehicleModel, vehicleYear, branchId, packageId, serviceType, appointmentDate, timeSlot, note, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
  ).run(
    id,
    trackingCode,
    input.fullName,
    input.phone,
    input.email ?? null,
    input.plate ?? null,
    input.vehicleBrand ?? null,
    input.vehicleModel ?? null,
    input.vehicleYear ?? null,
    input.branchId,
    input.packageId ?? null,
    input.serviceType ?? "BRANCH",
    input.appointmentDate,
    input.timeSlot,
    input.note ?? null,
  );
  return getAppointmentById(id)!;
}

export function updateAppointmentStatus(id: string, status: AppointmentStatus): Appointment | null {
  db.prepare(
    `UPDATE appointments SET status = ?, updatedAt = datetime('now') WHERE id = ?`,
  ).run(status, id);
  return getAppointmentById(id);
}

export function deleteAppointment(id: string): void {
  db.prepare(`DELETE FROM appointments WHERE id = ?`).run(id);
}

export function appointmentStats(): {
  total: number;
  pending: number;
  confirmed: number;
  today: number;
} {
  const total = (db.prepare(`SELECT COUNT(*) as c FROM appointments`).get() as { c: number }).c;
  const pending = (
    db.prepare(`SELECT COUNT(*) as c FROM appointments WHERE status = 'PENDING'`).get() as {
      c: number;
    }
  ).c;
  const confirmed = (
    db.prepare(`SELECT COUNT(*) as c FROM appointments WHERE status = 'CONFIRMED'`).get() as {
      c: number;
    }
  ).c;
  const today = (
    db
      .prepare(`SELECT COUNT(*) as c FROM appointments WHERE appointmentDate = date('now')`)
      .get() as { c: number }
  ).c;
  return { total, pending, confirmed, today };
}

export function listBookedSlots(branchId: string, date: string): string[] {
  const rows = db
    .prepare(
      `SELECT timeSlot FROM appointments WHERE branchId = ? AND appointmentDate = ? AND status != 'CANCELLED'`,
    )
    .all(branchId, date) as { timeSlot: string }[];
  return rows.map((r) => r.timeSlot);
}
