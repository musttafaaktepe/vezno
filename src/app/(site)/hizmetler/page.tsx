import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listServices } from "@/lib/data/services";
import { Section } from "../_components/Section";
import ServiceIcon from "../_components/ServiceIcon";

export const metadata: Metadata = {
  title: "Hizmetlerimiz",
  description:
    "Motor, boya-kaporta, şase, süspansiyon, fren ve daha fazlası — OtoVizör Ekspertiz'in sunduğu tüm oto ekspertiz hizmetleri.",
};

export default function ServicesPage() {
  const services = listServices({ onlyActive: true });

  return (
    <>
      <div className="border-b border-slate-200 bg-slate-950 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Hizmetlerimiz</h1>
          <p className="mt-4 text-slate-300">
            Aracın her sistemini ayrı ayrı, son teknoloji ölçüm cihazları ile inceliyor; her
            adımı raporunda sana gösteriyoruz.
          </p>
        </div>
      </div>

      <Section>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.id}
              href={`/hizmetler/${s.slug}`}
              className="group flex flex-col rounded-2xl border border-slate-200 p-6 transition hover:border-blue-200 hover:shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <ServiceIcon icon={s.icon} className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-slate-900">{s.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{s.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
                Detayları gör <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <div className="border-t border-slate-200 bg-slate-50 py-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-slate-900">Hangi paketin sana uygun olduğundan emin değil misin?</h2>
          <Link
            href="/paketler"
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Paketleri Karşılaştır
          </Link>
        </div>
      </div>
    </>
  );
}
