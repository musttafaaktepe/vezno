import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/settings";
import PageHeader from "../_components/PageHeader";
import SettingsForm from "./SettingsForm";

export const metadata: Metadata = { title: "Site Ayarları" };

export default function AdminSettingsPage() {
  const settings = getSiteSettings();

  return (
    <div>
      <PageHeader title="Site Ayarları" description="Sitenin genel bilgilerini ve metinlerini buradan düzenleyin." />
      <div className="max-w-3xl">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
