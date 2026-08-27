"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import type { Branch } from "@/lib/data/types";

export default function BranchesGrid({ branches }: { branches: Branch[] }) {
  const cities = useMemo(
    () => Array.from(new Set(branches.map((b) => b.city))).sort(),
    [branches],
  );
  const [city, setCity] = useState<string>("all");

  const filtered = city === "all" ? branches : branches.filter((b) => b.city === city);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setCity("all")}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
            city === "all"
              ? "border-blue-700 bg-blue-700 text-white"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Tümü
        </button>
        {cities.map((c) => (
          <button
            key={c}
            onClick={() => setCity(c)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              city === c
                ? "border-blue-700 bg-blue-700 text-white"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b) => (
          <div key={b.id} className="flex flex-col rounded-2xl border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-900">{b.name}</h2>
            <div className="mt-4 flex flex-1 flex-col gap-2.5 text-sm text-slate-600">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                {b.address}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-blue-700" />
                <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="hover:text-blue-700">
                  {b.phone}
                </a>
              </p>
              <p className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                {b.workingHours}
              </p>
            </div>
            <div className="mt-5 flex gap-2">
              {b.mapUrl && (
                <a
                  href={b.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Haritada Gör
                </a>
              )}
              <Link
                href={`/randevu-al?branch=${b.slug}`}
                className="flex-1 rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-800"
              >
                Randevu Al
              </Link>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-sm text-slate-500">
            Bu şehirde şubemiz bulunmuyor.
          </p>
        )}
      </div>
    </div>
  );
}
