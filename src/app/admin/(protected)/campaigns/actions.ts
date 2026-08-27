"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/session";
import { revalidatePublicSite } from "@/lib/revalidatePublicSite";
import { createCampaign, deleteCampaign, updateCampaign, type CampaignInput } from "@/lib/data/campaigns";

function readInput(formData: FormData): CampaignInput {
  return {
    title: formData.get("title")?.toString().trim() ?? "",
    description: formData.get("description")?.toString().trim() ?? "",
    badge: formData.get("badge")?.toString().trim() || null,
    validUntil: formData.get("validUntil")?.toString().trim() || null,
    sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
    active: formData.get("active") === "on",
  };
}

function revalidateCampaignPaths(): void {
  revalidatePath("/admin/campaigns");
  revalidatePublicSite();
}

export async function createCampaignAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  createCampaign(readInput(formData));
  revalidateCampaignPaths();
  redirect("/admin/campaigns");
}

export async function updateCampaignAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = formData.get("id")?.toString() ?? "";
  if (!id) return;
  updateCampaign(id, readInput(formData));
  revalidateCampaignPaths();
  redirect("/admin/campaigns");
}

export async function deleteCampaignAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = formData.get("id")?.toString() ?? "";
  if (!id) return;
  deleteCampaign(id);
  revalidateCampaignPaths();
  redirect("/admin/campaigns");
}
