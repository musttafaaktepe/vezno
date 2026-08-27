import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { listPackages } from "@/lib/data/packages";
import { Section, Container } from "../_components/Section";

export const metadata: Metadata = {
  title: "Paketler & Fiyatlar",
  description: "OtoVizör Ekspertiz paket seçenekleri ve güncel fiyatları.",
};

export default async function PackagesPage() {
  const packages = await listPackages({ onlyActive: true });

  return (
    <>
      <div className="border-b border-slate-200 bg-slate-950 py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Paketler &amp; Fiyatlar</h1>
            <p className="mt-4 text-slate-300">
              İhtiyacına ve bütçene uygun paketi seç, randevunu birkaç dakikada oluştur. Tüm
              fiyatlara detaylı rapor dahildir.
            </p>
          </div>
        </Container>
      </div>

      <Section>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {packages.map((p) => (
            <div
              key={p.id}
              className={`flex flex-col rounded-2xl border p-6 ${
                p.highlighted
                  ? "border-blue-600 bg-blue-700 text-white shadow-lg lg:-translate-y-2"
                  : "border-slate-200 bg-white"
              }`}
            >
              {p.highlighted && (
                <span className="mb-3 inline-flex w-fit items-center rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">
                  En Popüler
                </span>
              )}
              <h2 className={`text-base font-semibold ${p.highlighted ? "text-white" : "text-slate-900"}`}>
                {p.name}
              </h2>
              <p className={`mt-3 text-3xl font-bold ${p.highlighted ? "text-white" : "text-slate-900"}`}>
                {p.price.toLocaleString("tr-TR")} ₺
              </p>
              {p.duration && (
                <p className={`mt-1 text-xs font-medium ${p.highlighted ? "text-blue-100" : "text-slate-500"}`}>
                  Süre: {p.duration}
                </p>
              )}
              <p className={`mt-4 text-sm leading-relaxed ${p.highlighted ? "text-blue-50" : "text-slate-600"}`}>
                {p.description}
              </p>
              <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-start gap-2 text-sm ${
                      p.highlighted ? "text-blue-50" : "text-slate-600"
                    }`}
                  >
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${p.highlighted ? "text-white" : "text-blue-700"}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/randevu-al?package=${p.slug}`}
                className={`mt-6 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  p.highlighted
                    ? "bg-white text-blue-700 hover:bg-blue-50"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                Bu Paketi Seç
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          Fiyatlarımız araç segmentine göre değişebilir, kesin fiyat için şubenizle iletişime
          geçebilirsiniz. Tüm paketlere KDV dahildir.
        </p>
      </Section>
    </>
  );
}
