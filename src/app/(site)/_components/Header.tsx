"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "./nav";

export default function Header({
  brandName,
  phone,
}: {
  brandName: string;
  phone: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-sm font-bold text-white">CO</span>
          <span className="text-base font-bold tracking-tight text-slate-900">{brandName}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive(item.href)
                  ? "text-blue-700"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="text-sm font-semibold text-slate-700 hover:text-blue-700"
          >
            {phone}
          </a>
          <Link
            href="/randevu-al"
            className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Randevu Al
          </Link>
        </div>

        <button
          className="rounded-lg border border-slate-200 p-2 text-slate-700 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menü"
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2.5 text-sm font-medium ${
                  isActive(item.href) ? "bg-blue-50 text-blue-700" : "text-slate-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-700"
            >
              📞 {phone}
            </a>
            <Link
              href="/randevu-al"
              className="mt-1 rounded-lg bg-blue-700 px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Randevu Al
            </Link>
            <Link
              href="/randevu-sorgula"
              className="rounded-md px-3 py-2.5 text-center text-sm font-medium text-slate-600"
            >
              Randevumu Sorgula
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
