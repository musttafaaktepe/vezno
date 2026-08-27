import type { Metadata } from "next";
import { Eye, HandCoins, ShieldCheck, Users } from "lucide-react";
import { getSiteSettings } from "@/lib/data/settings";
import { listBranches } from "@/lib/data/branches";
import { Section, SectionHeading, Container } from "../_components/Section";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Cesa Oto Ekspertiz'in hikayesi, değerleri ve bağımsız ekspertiz yaklaşımı.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Bağımsızlık",
    text: "Hiçbir galeri veya satıcı ile ticari bağımız yok; raporlarımız yalnızca sizin çıkarınızı gözetir.",
  },
  {
    icon: Eye,
    title: "Şeffaflık",
    text: "Tespit ettiğimiz her bulguyu fotoğraflarla belgeleyip anlaşılır bir dille raporda paylaşırız.",
  },
  {
    icon: Users,
    title: "Uzmanlık",
    text: "Eksperlerimiz düzenli eğitimlerden geçer, son teknoloji ölçüm cihazlarıyla çalışır.",
  },
  {
    icon: HandCoins,
    title: "Adil Fiyatlandırma",
    text: "Şeffaf paket fiyatları ile sürpriz ek ücret olmadan hizmet alırsınız.",
  },
];

export default async function AboutPage() {
  const [settings, branches] = await Promise.all([getSiteSettings(), listBranches({ onlyActive: true })]);

  return (
    <>
      <div className="border-b border-slate-200 bg-slate-950 py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Hakkımızda</h1>
            <p className="mt-4 text-slate-300">{settings.tagline}</p>
          </div>
        </Container>
      </div>

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-slate-700">{settings.aboutText}</p>
        </div>
      </Section>

      <Section className="bg-slate-50">
        <SectionHeading eyebrow="Değerlerimiz" title="Bizi biz yapan ilkeler" center />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <v.icon className="mx-auto h-8 w-8 text-blue-700" strokeWidth={1.5} />
              <h3 className="mt-4 text-base font-semibold text-slate-900">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { value: "2011", label: "Kuruluş Yılı" },
            { value: `${branches.length}+`, label: "Şube" },
            { value: "120+", label: "Kontrol Noktası" },
            { value: "%100", label: "Bağımsız Rapor" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
