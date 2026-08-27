"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/session";
import { revalidatePublicSite } from "@/lib/revalidatePublicSite";
import { updateSiteSettings, type SiteSettingsInput } from "@/lib/data/settings";

export interface SettingsState {
  success?: boolean;
}

export async function updateSiteSettingsAction(
  _prevState: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  await requireAdminSession();

  const input: SiteSettingsInput = {
    brandName: formData.get("brandName")?.toString().trim() ?? "",
    tagline: formData.get("tagline")?.toString().trim() ?? "",
    phone: formData.get("phone")?.toString().trim() ?? "",
    whatsapp: formData.get("whatsapp")?.toString().trim() || null,
    email: formData.get("email")?.toString().trim() ?? "",
    address: formData.get("address")?.toString().trim() || null,
    heroTitle: formData.get("heroTitle")?.toString().trim() ?? "",
    heroSubtitle: formData.get("heroSubtitle")?.toString().trim() ?? "",
    aboutText: formData.get("aboutText")?.toString().trim() ?? "",
    instagramUrl: formData.get("instagramUrl")?.toString().trim() || null,
    facebookUrl: formData.get("facebookUrl")?.toString().trim() || null,
    youtubeUrl: formData.get("youtubeUrl")?.toString().trim() || null,
    workingHours: formData.get("workingHours")?.toString().trim() || null,
  };

  updateSiteSettings(input);
  revalidatePublicSite();
  revalidatePath("/admin/settings");

  return { success: true };
}
