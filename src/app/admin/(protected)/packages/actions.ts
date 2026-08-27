"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/session";
import { revalidatePublicSite } from "@/lib/revalidatePublicSite";
import { createPackage, deletePackage, updatePackage, type PackageInput } from "@/lib/data/packages";

function readInput(formData: FormData): PackageInput {
  const featuresRaw = formData.get("features")?.toString() ?? "";
  const features = featuresRaw
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);
  return {
    name: formData.get("name")?.toString().trim() ?? "",
    price: Number(formData.get("price") ?? 0) || 0,
    duration: formData.get("duration")?.toString().trim() || null,
    description: formData.get("description")?.toString().trim() ?? "",
    features,
    highlighted: formData.get("highlighted") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
    active: formData.get("active") === "on",
  };
}

export async function createPackageAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  await createPackage(readInput(formData));
  revalidatePath("/admin/packages");
  revalidatePublicSite();
  redirect("/admin/packages");
}

export async function updatePackageAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = formData.get("id")?.toString() ?? "";
  if (!id) return;
  await updatePackage(id, readInput(formData));
  revalidatePath("/admin/packages");
  revalidatePublicSite();
  redirect("/admin/packages");
}

export async function deletePackageAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = formData.get("id")?.toString() ?? "";
  if (!id) return;
  await deletePackage(id);
  revalidatePath("/admin/packages");
  revalidatePublicSite();
  redirect("/admin/packages");
}
