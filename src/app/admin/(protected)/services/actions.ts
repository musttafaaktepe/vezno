"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/session";
import { revalidatePublicSite } from "@/lib/revalidatePublicSite";
import { createService, deleteService, updateService, type ServiceInput } from "@/lib/data/services";

function readInput(formData: FormData): ServiceInput {
  return {
    title: formData.get("title")?.toString().trim() ?? "",
    summary: formData.get("summary")?.toString().trim() ?? "",
    description: formData.get("description")?.toString().trim() ?? "",
    icon: formData.get("icon")?.toString() || null,
    sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
    active: formData.get("active") === "on",
  };
}

export async function createServiceAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  createService(readInput(formData));
  revalidatePath("/admin/services");
  revalidatePublicSite();
  redirect("/admin/services");
}

export async function updateServiceAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = formData.get("id")?.toString() ?? "";
  if (!id) return;
  updateService(id, readInput(formData));
  revalidatePath("/admin/services");
  revalidatePublicSite();
  redirect("/admin/services");
}

export async function deleteServiceAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = formData.get("id")?.toString() ?? "";
  if (!id) return;
  deleteService(id);
  revalidatePath("/admin/services");
  revalidatePublicSite();
  redirect("/admin/services");
}
