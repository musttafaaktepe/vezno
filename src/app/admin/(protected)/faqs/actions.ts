"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/session";
import { revalidatePublicSite } from "@/lib/revalidatePublicSite";
import { createFaq, deleteFaq, updateFaq, type FaqInput } from "@/lib/data/faqs";

function readInput(formData: FormData): FaqInput {
  return {
    question: formData.get("question")?.toString().trim() ?? "",
    answer: formData.get("answer")?.toString().trim() ?? "",
    sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
    active: formData.get("active") === "on",
  };
}

function revalidateFaqPaths(): void {
  revalidatePath("/admin/faqs");
  revalidatePublicSite();
}

export async function createFaqAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  createFaq(readInput(formData));
  revalidateFaqPaths();
  redirect("/admin/faqs");
}

export async function updateFaqAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = formData.get("id")?.toString() ?? "";
  if (!id) return;
  updateFaq(id, readInput(formData));
  revalidateFaqPaths();
  redirect("/admin/faqs");
}

export async function deleteFaqAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = formData.get("id")?.toString() ?? "";
  if (!id) return;
  deleteFaq(id);
  revalidateFaqPaths();
  redirect("/admin/faqs");
}
