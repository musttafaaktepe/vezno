import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Car, Clock, MapPinned, ShieldCheck } from "lucide-react";
import { listPackages } from "@/lib/data/packages";
import { Section, SectionHeading, Container } from "../_components/Section";

export const metadata: Metadata = {
  title: "Mobil Ekspertiz",
  description:
    "Şubeye gelmenize gerek yok. Mobil ekspertiz ekibimiz, taşınabilir ölçüm cihazlarıyla aracın bulunduğu yere gelir.",
};

export default async function MobileExpertisePage() {
  const mobilePackage = (await listPackages({ onlyActive: true })).find((p) =>
    p.slug.includes("mobil"),
  );

  return (
    <>
      <div className="relative overflow-hidden bg-slate-950 py-20">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-700/30 blur-3xl" />
        <Container className="relative">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Mobil Ekspertiz</h1>
            <p className="mt-4 text-lg text-slate-300">
              Evinizde, iş yerinizde ya da satıcının bulunduğu yerde — taşınabilir ölçüm
              cihazlarıyla donatılmış ekibimiz, şubeye gelmenize gerek kalmadan aracı yerinde
              inceler.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={mobilePackage ? `/randevu-al?package=${mobilePackage.slug}&type=mobile` : "/randevu-al?type=mobile"}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Mobil Randevu Al <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <Section>
        <SectionHeading eyebrow="Neden Mobil Ekspertiz" title="Zaman kaybetmeden, olduğunuz yerde güvence" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: MapPinned,
              title: "Yerinizde Hizmet",
              text: "İstanbul, Ankara ve İzmir il sınırları içinde adresinize geliyoruz.",
            },
            {
              icon: Clock,
              title: "Zamandan Tasarruf",
              text: "Şubeye gitmenize, sıra beklemenize gerek yok, günlük programınızı bölmeden kontrol tamamlanır.",
            },
            {
              icon: ShieldCheck,
              title: "Aynı Kalite",
              text: "Şubelerimizdekiyle birebir aynı, kalibre edilmiş taşınabilir ölçüm cihazları kullanılır.",
            },
            {
              icon: Car,
              title: "Her Araç İçin Uygun",
              text: "İkinci el alım-satım öncesi, galeri ziyaretlerinde ya da filo araçlarında rahatlıkla kullanılır.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 p-6">
              <item.icon className="h-8 w-8 text-blue-700" strokeWidth={1.5} />
              <h3 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-slate-50">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Nasıl İşliyor" title="3 adımda mobil ekspertiz" />
            <ol className="flex flex-col gap-5">
              {[
                "Online randevu formundan 'Mobil Ekspertiz' seçeneğini işaretleyip adresini paylaş.",
                "Belirlenen saatte ekibimiz, taşınabilir cihazlarıyla adresine gelir.",
                "Kontrol tamamlanır tamamlanmaz raporun aynı gün içinde e-posta ile sana ulaşır.",
              ].map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-slate-700">{step}</p>
                </li>
              ))}
            </ol>
          </div>
          {mobilePackage && (
            <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">{mobilePackage.name}</h3>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {mobilePackage.price.toLocaleString("tr-TR")} ₺
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">Süre: {mobilePackage.duration}</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{mobilePackage.description}</p>
              <Link
                href={`/randevu-al?package=${mobilePackage.slug}&type=mobile`}
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Bu Paketle Randevu Al
              </Link>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
