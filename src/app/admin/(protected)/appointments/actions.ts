"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/session";
import { deleteAppointment, updateAppointmentStatus } from "@/lib/data/appointments";
import type { AppointmentStatus } from "@/lib/data/types";

const VALID_STATUSES: AppointmentStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export async function updateAppointmentStatusAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = formData.get("id")?.toString() ?? "";
  const status = formData.get("status")?.toString() as AppointmentStatus;
  if (!id || !VALID_STATUSES.includes(status)) return;
  await updateAppointmentStatus(id, status);
  revalidatePath("/admin/appointments");
  revalidatePath(`/admin/appointments/${id}`);
  revalidatePath("/admin");
}

export async function deleteAppointmentAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = formData.get("id")?.toString() ?? "";
  if (!id) return;
  await deleteAppointment(id);
  revalidatePath("/admin/appointments");
  revalidatePath("/admin");
  redirect("/admin/appointments");
}
