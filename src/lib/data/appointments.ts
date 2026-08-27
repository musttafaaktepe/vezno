import { queryAll, queryOne, execute, type Row } from "@/lib/db";
import { genId, genTrackingCode } from "@/lib/ids";
import type { Appointment, AppointmentServiceType, AppointmentStatus } from "./types";

function mapRow(row: Row): Appointment {
  return {
    id: row.id as string,
    trackingCode: row.trackingCode as string,
    fullName: row.fullName as string,
    phone: row.phone as string,
    email: (row.email as string | null) ?? null,
    plate: (row.plate as string | null) ?? null,
    vehicleBrand: (row.vehicleBrand as string | null) ?? null,
    vehicleModel: (row.vehicleModel as string | null) ?? null,
    vehicleYear: (row.vehicleYear as string | null) ?? null,
    branchId: row.branchId as string,
    packageId: (row.packageId as string | null) ?? null,
    serviceType: row.serviceType as AppointmentServiceType,
    appointmentDate: row.appointmentDate as string,
    timeSlot: row.timeSlot as string,
    note: (row.note as string | null) ?? null,
    status: row.status as AppointmentStatus,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  };
}

export async function listAppointments(
  filters: {
    status?: AppointmentStatus;
    branchId?: string;
    q?: string;
  } = {},
): Promise<Appointment[]> {
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
  const rows = await queryAll(
    `SELECT * FROM appointments ${where} ORDER BY appointmentDate DESC, timeSlot DESC`,
    params,
  );
  return rows.map(mapRow);
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const row = await queryOne(`SELECT * FROM appointments WHERE id = ?`, [id]);
  return row ? mapRow(row) : null;
}

export async function getAppointmentByTrackingCode(trackingCode: string): Promise<Appointment | null> {
  const row = await queryOne(`SELECT * FROM appointments WHERE UPPER(trackingCode) = UPPER(?)`, [
    trackingCode.trim(),
  ]);
  return row ? mapRow(row) : null;
}

export async function findAppointmentByTrackingCodeAndPhone(
  trackingCode: string,
  phone: string,
): Promise<Appointment | null> {
  const normalizedPhone = phone.replace(/\D/g, "");
  const row = await queryOne(
    `SELECT * FROM appointments WHERE UPPER(trackingCode) = UPPER(?) AND REPLACE(REPLACE(REPLACE(phone, ' ', ''), '(', ''), ')', '') LIKE '%' || ? || '%'`,
    [trackingCode.trim(), normalizedPhone],
  );
  return row ? mapRow(row) : null;
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

export async function createAppointment(input: AppointmentInput): Promise<Appointment> {
  const id = genId();
  let trackingCode = genTrackingCode();
  while (await queryOne(`SELECT 1 as one FROM appointments WHERE trackingCode = ?`, [trackingCode])) {
    trackingCode = genTrackingCode();
  }
  await execute(
    `INSERT INTO appointments (id, trackingCode, fullName, phone, email, plate, vehicleBrand, vehicleModel, vehicleYear, branchId, packageId, serviceType, appointmentDate, timeSlot, note, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
    [
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
    ],
  );
  return (await getAppointmentById(id))!;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<Appointment | null> {
  await execute(`UPDATE appointments SET status = ?, updatedAt = datetime('now') WHERE id = ?`, [status, id]);
  return getAppointmentById(id);
}

export async function deleteAppointment(id: string): Promise<void> {
  await execute(`DELETE FROM appointments WHERE id = ?`, [id]);
}

export async function appointmentStats(): Promise<{
  total: number;
  pending: number;
  confirmed: number;
  today: number;
}> {
  const [total, pending, confirmed, today] = await Promise.all([
    queryOne(`SELECT COUNT(*) as c FROM appointments`),
    queryOne(`SELECT COUNT(*) as c FROM appointments WHERE status = 'PENDING'`),
    queryOne(`SELECT COUNT(*) as c FROM appointments WHERE status = 'CONFIRMED'`),
    queryOne(`SELECT COUNT(*) as c FROM appointments WHERE appointmentDate = date('now')`),
  ]);
  return {
    total: Number(total?.c ?? 0),
    pending: Number(pending?.c ?? 0),
    confirmed: Number(confirmed?.c ?? 0),
    today: Number(today?.c ?? 0),
  };
}

export async function listBookedSlots(branchId: string, date: string): Promise<string[]> {
  const rows = await queryAll(
    `SELECT timeSlot FROM appointments WHERE branchId = ? AND appointmentDate = ? AND status != 'CANCELLED'`,
    [branchId, date],
  );
  return rows.map((r) => r.timeSlot as string);
}
