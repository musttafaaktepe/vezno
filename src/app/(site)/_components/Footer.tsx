import Link from "next/link";
import type { SiteSettings } from "@/lib/data/types";
import type { Service } from "@/lib/data/types";
import type { Branch } from "@/lib/data/types";
import { NAV_LINKS } from "./nav";

export default function Footer({
  settings,
  services,
  branches,
}: {
  settings: SiteSettings;
  services: Service[];
  branches: Branch[];
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-sm font-bold text-white">CO</span>
            <span className="text-base font-bold text-white">{settings.brandName}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">{settings.tagline}</p>
          <div className="mt-4 flex gap-3 text-sm">
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} className="hover:text-white" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            )}
            {settings.facebookUrl && (
              <a href={settings.facebookUrl} className="hover:text-white" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            )}
            {settings.youtubeUrl && (
              <a href={settings.youtubeUrl} className="hover:text-white" target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Kurumsal</h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-slate-400 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/randevu-sorgula" className="text-slate-400 hover:text-white">
                Randevumu Sorgula
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Hizmetlerimiz</h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {services.slice(0, 6).map((s) => (
              <li key={s.id}>
                <Link href={`/hizmetler/${s.slug}`} className="text-slate-400 hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">İletişim</h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-slate-400">
            <li>
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-white">
                {settings.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="hover:text-white">
                {settings.email}
              </a>
            </li>
            {settings.address && <li>{settings.address}</li>}
            {settings.workingHours && <li>{settings.workingHours}</li>}
          </ul>
          {branches.length > 0 && (
            <p className="mt-4 text-sm text-slate-500">
              {branches.length}+ şubemizle hizmetinizdeyiz.{" "}
              <Link href="/subeler" className="text-blue-400 hover:text-blue-300">
                Tüm şubeler →
              </Link>
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-slate-800 py-5">
        <p className="px-4 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
          © {year} {settings.brandName}. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
