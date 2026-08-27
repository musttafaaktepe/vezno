"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/session";
import { deleteContactMessage, markMessageRead } from "@/lib/data/contactMessages";

export async function markMessageReadAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = formData.get("id")?.toString() ?? "";
  const isRead = formData.get("isRead") === "true";
  if (!id) return;
  await markMessageRead(id, isRead);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessageAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = formData.get("id")?.toString() ?? "";
  if (!id) return;
  await deleteContactMessage(id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
