"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/session";
import { revalidatePublicSite } from "@/lib/revalidatePublicSite";
import {
  createTestimonial,
  deleteTestimonial,
  updateTestimonial,
  type TestimonialInput,
} from "@/lib/data/testimonials";

function readInput(formData: FormData): TestimonialInput {
  return {
    name: formData.get("name")?.toString().trim() ?? "",
    city: formData.get("city")?.toString().trim() || null,
    vehicle: formData.get("vehicle")?.toString().trim() || null,
    rating: Math.min(5, Math.max(1, Number(formData.get("rating") ?? 5) || 5)),
    comment: formData.get("comment")?.toString().trim() ?? "",
    sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
    active: formData.get("active") === "on",
  };
}

function revalidateTestimonialPaths(): void {
  revalidatePath("/admin/testimonials");
  revalidatePublicSite();
}

export async function createTestimonialAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  await createTestimonial(readInput(formData));
  revalidateTestimonialPaths();
  redirect("/admin/testimonials");
}

export async function updateTestimonialAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = formData.get("id")?.toString() ?? "";
  if (!id) return;
  await updateTestimonial(id, readInput(formData));
  revalidateTestimonialPaths();
  redirect("/admin/testimonials");
}

export async function deleteTestimonialAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = formData.get("id")?.toString() ?? "";
  if (!id) return;
  await deleteTestimonial(id);
  revalidateTestimonialPaths();
  redirect("/admin/testimonials");
}
