import { db } from "@/lib/db";
import { toPlain } from "./util";
import type { SiteSettings } from "./types";

export function getSiteSettings(): SiteSettings {
  const row = db
    .prepare(`SELECT * FROM siteSettings WHERE id = 'main'`)
    .get() as unknown as SiteSettings;
  return toPlain(row);
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
}

export function updateSiteSettings(input: SiteSettingsInput): SiteSettings {
  db.prepare(
    `UPDATE siteSettings SET brandName = ?, tagline = ?, phone = ?, whatsapp = ?, email = ?, address = ?, heroTitle = ?, heroSubtitle = ?, aboutText = ?, instagramUrl = ?, facebookUrl = ?, youtubeUrl = ?, workingHours = ?, updatedAt = datetime('now') WHERE id = 'main'`,
  ).run(
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
  );
  return getSiteSettings();
}
