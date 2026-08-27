"use client";

import { useActionState } from "react";
import type { SiteSettings } from "@/lib/data/types";
import { updateSiteSettingsAction, type SettingsState } from "./actions";
import { cardClass, inputClass, labelClass, textareaClass } from "../_components/ui";
import SubmitButton from "../_components/SubmitButton";

const initialState: SettingsState = {};

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState(updateSiteSettingsAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.success && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
          Ayarlar başarıyla kaydedildi.
        </p>
      )}

      <div className={cardClass}>
        <h2 className="text-sm font-semibold text-slate-900">Marka</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="brandName">
              Marka Adı *
            </label>
            <input id="brandName" name="brandName" required defaultValue={settings.brandName} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="tagline">
              Slogan *
            </label>
            <input id="tagline" name="tagline" required defaultValue={settings.tagline} className={inputClass} />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="text-sm font-semibold text-slate-900">Anasayfa Metinleri</h2>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="heroTitle">
              Ana Başlık *
            </label>
            <input id="heroTitle" name="heroTitle" required defaultValue={settings.heroTitle} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="heroSubtitle">
              Alt Başlık *
            </label>
            <textarea
              id="heroSubtitle"
              name="heroSubtitle"
              required
              rows={2}
              defaultValue={settings.heroSubtitle}
              className={textareaClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="aboutText">
              Hakkımızda Metni *
            </label>
            <textarea
              id="aboutText"
              name="aboutText"
              required
              rows={4}
              defaultValue={settings.aboutText}
              className={textareaClass}
            />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="text-sm font-semibold text-slate-900">İletişim Bilgileri</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="phone">
              Telefon *
            </label>
            <input id="phone" name="phone" required defaultValue={settings.phone} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="whatsapp">
              WhatsApp Numarası
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              placeholder="90XXXXXXXXXX"
              defaultValue={settings.whatsapp ?? ""}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="email">
              E-posta *
            </label>
            <input id="email" name="email" type="email" required defaultValue={settings.email} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="workingHours">
              Çalışma Saatleri
            </label>
            <input
              id="workingHours"
              name="workingHours"
              defaultValue={settings.workingHours ?? ""}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className={labelClass} htmlFor="address">
              Genel Merkez Adresi
            </label>
            <textarea
              id="address"
              name="address"
              rows={2}
              defaultValue={settings.address ?? ""}
              className={textareaClass}
            />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="text-sm font-semibold text-slate-900">Sosyal Medya</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="instagramUrl">
              Instagram
            </label>
            <input id="instagramUrl" name="instagramUrl" defaultValue={settings.instagramUrl ?? ""} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="facebookUrl">
              Facebook
            </label>
            <input id="facebookUrl" name="facebookUrl" defaultValue={settings.facebookUrl ?? ""} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="youtubeUrl">
              YouTube
            </label>
            <input id="youtubeUrl" name="youtubeUrl" defaultValue={settings.youtubeUrl ?? ""} className={inputClass} />
          </div>
        </div>
      </div>

      <div>
        <SubmitButton>Ayarları Kaydet</SubmitButton>
      </div>
    </form>
  );
}
