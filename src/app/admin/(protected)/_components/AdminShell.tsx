"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "../actions";

const NAV_ITEMS = [
  { href: "/admin", label: "Panel", exact: true },
  { href: "/admin/appointments", label: "Randevular" },
  { href: "/admin/messages", label: "Mesajlar" },
  { href: "/admin/services", label: "Hizmetler" },
  { href: "/admin/packages", label: "Paketler" },
  { href: "/admin/branches", label: "Şubeler" },
  { href: "/admin/campaigns", label: "Kampanyalar" },
  { href: "/admin/testimonials", label: "Yorumlar" },
  { href: "/admin/faqs", label: "S.S.S." },
  { href: "/admin/settings", label: "Site Ayarları" },
] as const;

export default function AdminShell({
  name,
  email,
  children,
}: {
  name: string;
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="flex min-h-screen">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-slate-200 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-sm font-bold text-white">CO</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight text-slate-900">
              Cesa Oto Ekspertiz
            </p>
            <p className="text-xs leading-tight text-slate-500">Yönetim Paneli</p>
          </div>
        </div>
        <nav className="flex flex-col gap-0.5 p-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive(item.href, "exact" in item ? item.exact : false)
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t border-slate-200 p-3">
          <Link
            href="/"
            target="_blank"
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Siteyi Görüntüle ↗
          </Link>
        </div>
      </aside>

      {mobileOpen && (
        <button
          aria-label="Menüyü kapat"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
        />
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
          <button
            className="rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Menüyü aç"
          >
            ☰
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium leading-tight text-slate-900">{name}</p>
              <p className="text-xs leading-tight text-slate-500">{email}</p>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Çıkış
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 bg-slate-50 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
