"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/session";
import { revalidatePublicSite } from "@/lib/revalidatePublicSite";
import { createBranch, deleteBranch, updateBranch, type BranchInput } from "@/lib/data/branches";

function readInput(formData: FormData): BranchInput {
  return {
    name: formData.get("name")?.toString().trim() ?? "",
    city: formData.get("city")?.toString().trim() ?? "",
    district: formData.get("district")?.toString().trim() || null,
    address: formData.get("address")?.toString().trim() ?? "",
    phone: formData.get("phone")?.toString().trim() ?? "",
    workingHours: formData.get("workingHours")?.toString().trim() ?? "",
    mapUrl: formData.get("mapUrl")?.toString().trim() || null,
    sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
    active: formData.get("active") === "on",
  };
}

function revalidateBranchPaths(): void {
  revalidatePath("/admin/branches");
  revalidatePublicSite();
}

export async function createBranchAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  createBranch(readInput(formData));
  revalidateBranchPaths();
  redirect("/admin/branches");
}

export async function updateBranchAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = formData.get("id")?.toString() ?? "";
  if (!id) return;
  updateBranch(id, readInput(formData));
  revalidateBranchPaths();
  redirect("/admin/branches");
}

export async function deleteBranchAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = formData.get("id")?.toString() ?? "";
  if (!id) return;
  deleteBranch(id);
  revalidateBranchPaths();
  redirect("/admin/branches");
}
