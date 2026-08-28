import { queryOne, execute, type Row } from "@/lib/db";
import type { SiteSettings } from "./types";

function mapRow(row: Row): SiteSettings {
  return {
    id: row.id as string,
    brandName: row.brandName as string,
    tagline: row.tagline as string,
    phone: row.phone as string,
    whatsapp: (row.whatsapp as string | null) ?? null,
    email: row.email as string,
    address: (row.address as string | null) ?? null,
    heroTitle: row.heroTitle as string,
    heroSubtitle: row.heroSubtitle as string,
    aboutText: row.aboutText as string,
    instagramUrl: (row.instagramUrl as string | null) ?? null,
    facebookUrl: (row.facebookUrl as string | null) ?? null,
    youtubeUrl: (row.youtubeUrl as string | null) ?? null,
    workingHours: (row.workingHours as string | null) ?? null,
    mapsUrl: (row.mapsUrl as string | null) ?? null,
    updatedAt: row.updatedAt as string,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const row = await queryOne(`SELECT * FROM siteSettings WHERE id = 'main'`);
  return mapRow(row!);
}

export interface SiteSettingsInput {
  brandName: string;
  tagline: string;
  phone: string;
  whatsapp?: string | null;
  email: string;
  address?: string | null;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
  workingHours?: string | null;
  mapsUrl?: string | null;
}

export async function updateSiteSettings(input: SiteSettingsInput): Promise<SiteSettings> {
  await execute(
    `UPDATE siteSettings SET brandName = ?, tagline = ?, phone = ?, whatsapp = ?, email = ?, address = ?, heroTitle = ?, heroSubtitle = ?, aboutText = ?, instagramUrl = ?, facebookUrl = ?, youtubeUrl = ?, workingHours = ?, mapsUrl = ?, updatedAt = datetime('now') WHERE id = 'main'`,
    [
      input.brandName,
      input.tagline,
      input.phone,
      input.whatsapp ?? null,
      input.email,
      input.address ?? null,
      input.heroTitle,
      input.heroSubtitle,
      input.aboutText,
      input.instagramUrl ?? null,
      input.facebookUrl ?? null,
      input.youtubeUrl ?? null,
      input.workingHours ?? null,
      input.mapsUrl ?? null,
    ],
  );
  return getSiteSettings();
}
