import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  ChevronRight,
  ClipboardCheck,
  ExternalLink,
  FileCheck2,
  MapPin,
  Star,
} from "lucide-react";
import { getSiteSettings } from "@/lib/data/settings";
import { listServices } from "@/lib/data/services";
import { listPackages } from "@/lib/data/packages";
import { listCampaigns } from "@/lib/data/campaigns";
import { listTestimonials } from "@/lib/data/testimonials";
import { listBranches } from "@/lib/data/branches";
import { listFaqs } from "@/lib/data/faqs";
import { Section, SectionHeading, Eyebrow, Container } from "./_components/Section";
import ServiceIcon from "./_components/ServiceIcon";

export default async function HomePage() {
  const [settings, services, packages, campaigns, testimonials, branches, allFaqs] = await Promise.all([
    getSiteSettings(),
    listServices({ onlyActive: true }),
    listPackages({ onlyActive: true }),
    listCampaigns({ onlyActive: true }),
    listTestimonials({ onlyActive: true }),
    listBranches({ onlyActive: true }),
    listFaqs({ onlyActive: true }),
  ]);
  const faqs = allFaqs.slice(0, 5);

  const quickLinks: { label: string; href: string; external?: boolean }[] = [
    { label: "Randevu Al", href: "/randevu-al" },
    { label: "Randevu Sorgula", href: "/randevu-sorgula" },
    { label: "Fiyat Listesi", href: "/paketler" },
    {
      label: "Araç Muayene Randevusu",
      href: "https://reservation.tuvturk.com.tr/web.ui/Index.aspx",
      external: true,
    },
    {
      label: "Taşıt Vergisi Ödeme",
      href: "https://dijital.gib.gov.tr/hizliOdemeler/MTVTPCOdeme",
      external: true,
    },
    { label: "Vergi Borcu Sorgulama", href: "https://dijital.gib.gov.tr/", external: true },
    {
      label: "Nöbetçi Noter",
      href: "https://portal.tnb.org.tr/Sayfalar/NobetciNoterBul.aspx",
      external: true,
    },
    {
      label: "Trafik İhlali Sorgulama",
      href: "https://webihlaltakip.kgm.gov.tr/WebIhlalSorgulama/Sayfalar/Sorgulama",
      external: true,
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-700/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />
        <Container className="relative py-20 sm:py-28">
          <div className="max-w-2xl">
            <Eyebrow>
              <span className="text-blue-400">Bağımsız &amp; Tarafsız Oto Ekspertiz</span>
            </Eyebrow>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {settings.heroTitle}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">{settings.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/randevu-al"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                Randevu Al <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/paketler"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Paketleri İncele
              </Link>
            </div>
            <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <div>
                <dt className="text-2xl font-bold text-white sm:text-3xl">120+</dt>
                <dd className="mt-1 text-sm text-slate-400">Kontrol Noktası</dd>
              </div>
              <div>
                <dt className="text-2xl font-bold text-white sm:text-3xl">{branches.length || 6}</dt>
                <dd className="mt-1 text-sm text-slate-400">Şube</dd>
              </div>
              <div>
                <dt className="text-2xl font-bold text-white sm:text-3xl">2011&apos;den beri</dt>
                <dd className="mt-1 text-sm text-slate-400">Bağımsız Hizmet</dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      {/* Campaigns strip */}
      {campaigns.length > 0 && (
        <div className="border-b border-amber-100 bg-amber-50">
          <Container className="flex flex-wrap items-center gap-2 py-3 text-sm text-amber-900">
            <span className="font-semibold">🎉 {campaigns[0].title}</span>
            <span className="hidden sm:inline">— {campaigns[0].description}</span>
            <Link href="/kampanyalar" className="ml-auto font-semibold text-amber-700 hover:underline">
              Tüm kampanyalar →
            </Link>
          </Container>
        </div>
      )}

      {/* Quick links */}
      <Section className="bg-slate-50 !py-12">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {quickLinks.map((link) => {
            const cardClass =
              "group flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-blue-300 hover:shadow-md";
            const content = (
              <>
                <span className="flex items-center gap-1.5">
                  {link.label}
                  {link.external && <ExternalLink className="h-3 w-3 text-slate-400" />}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
              </>
            );
            return link.external ? (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className={cardClass}>
                {content}
              </a>
            ) : (
              <Link key={link.label} href={link.href} className={cardClass}>
                {content}
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Services */}
      <Section>
        <SectionHeading
          eyebrow="Hizmetlerimiz"
          title="Aracın her noktasını uzman gözüyle inceliyoruz"
          description="Motor performansından boya-kaporta durumuna, süspansiyondan elektronik donanıma kadar tüm kritik noktalar tek raporda."
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 8).map((s) => (
            <Link
              key={s.id}
              href={`/hizmetler/${s.slug}`}
              className="group rounded-2xl border border-slate-200 p-6 transition hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-100">
                <ServiceIcon icon={s.icon} className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.summary}</p>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/hizmetler" className="text-sm font-semibold text-blue-700 hover:underline">
            Tüm hizmetleri gör →
          </Link>
        </div>
      </Section>

      {/* How it works */}
      <Section className="bg-slate-50">
        <SectionHeading
          eyebrow="Nasıl Çalışır"
          title="3 adımda net ve tarafsız bir rapor"
          center
        />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            {
              icon: CalendarCheck,
              title: "Randevu Al",
              text: "Şubelerimizden birini ya da mobil ekspertizi seçerek online randevunu birkaç dakikada oluştur.",
            },
            {
              icon: ClipboardCheck,
              title: "Detaylı Kontrol",
              text: "Uzman eksperlerimiz 120'den fazla noktadan aracı test cihazlarıyla inceler.",
            },
            {
              icon: FileCheck2,
              title: "Raporunu Al",
              text: "Fotoğraflı ve puanlı raporun aynı gün içinde PDF olarak sana ulaşır.",
            },
          ].map((step, i) => (
            <div key={step.title} className="relative rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100">
              <span className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
                {i + 1}
              </span>
              <step.icon className="mx-auto mt-2 h-8 w-8 text-blue-700" strokeWidth={1.5} />
              <h3 className="mt-4 text-base font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Packages preview */}
      <Section>
        <SectionHeading
          eyebrow="Paketler"
          title="İhtiyacına uygun ekspertiz paketini seç"
          description="Hızlı kontrolden uçtan uca kapsamlı incelemeye kadar farklı bütçe ve ihtiyaçlara uygun paketler."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {packages.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className={`flex flex-col rounded-2xl border p-6 ${
                p.highlighted ? "border-blue-600 bg-blue-700 text-white shadow-lg" : "border-slate-200"
              }`}
            >
              {p.highlighted && (
                <span className="mb-3 inline-flex w-fit items-center rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">
                  En Popüler
                </span>
              )}
              <h3 className={`text-base font-semibold ${p.highlighted ? "text-white" : "text-slate-900"}`}>
                {p.name}
              </h3>
              <p className={`mt-2 text-2xl font-bold ${p.highlighted ? "text-white" : "text-slate-900"}`}>
                {p.price.toLocaleString("tr-TR")} ₺
              </p>
              <p className={`text-xs ${p.highlighted ? "text-blue-100" : "text-slate-500"}`}>{p.duration}</p>
              <p className={`mt-3 text-sm leading-relaxed ${p.highlighted ? "text-blue-50" : "text-slate-600"}`}>
                {p.description}
              </p>
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
        <div className="mt-10 text-center">
          <Link href="/paketler" className="text-sm font-semibold text-blue-700 hover:underline">
            Tüm paketleri ve fiyatları gör →
          </Link>
        </div>
      </Section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <Section className="bg-slate-50">
          <SectionHeading eyebrow="Müşteri Yorumları" title="Bizi tercih edenler ne diyor?" center />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 6).map((t) => (
              <figure key={t.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4" fill={i < t.rating ? "currentColor" : "none"} strokeWidth={1.5} />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-slate-700">
                  &ldquo;{t.comment}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-slate-900">
                  {t.name}
                  <span className="block text-xs font-normal text-slate-500">
                    {[t.city, t.vehicle].filter(Boolean).join(" · ")}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      {/* Branches teaser */}
      <Section>
        <SectionHeading
          eyebrow="Şubelerimiz"
          title="Size en yakın şubeyi bulun"
          description="Türkiye genelinde büyüyen şube ağımızla yanınızdayız, dilerseniz mobil ekspertiz ekibimizi de çağırabilirsiniz."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {branches.slice(0, 6).map((b) => (
            <div key={b.id} className="flex items-start gap-3 rounded-2xl border border-slate-200 p-5">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
              <div>
                <p className="text-sm font-semibold text-slate-900">{b.name}</p>
                <p className="mt-1 text-sm text-slate-600">{b.address}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/subeler" className="text-sm font-semibold text-blue-700 hover:underline">
            Tüm şubeleri gör →
          </Link>
        </div>
      </Section>

      {/* FAQ preview */}
      {faqs.length > 0 && (
        <Section className="bg-slate-50">
          <SectionHeading eyebrow="Merak Edilenler" title="Sık Sorulan Sorular" />
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {faqs.map((f) => (
              <details key={f.id} className="group p-5">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {f.question}
                    <span className="text-slate-400 transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/sss" className="text-sm font-semibold text-blue-700 hover:underline">
              Tüm soruları gör →
            </Link>
          </div>
        </Section>
      )}

      {/* Final CTA */}
      <section className="bg-blue-700">
        <Container className="flex flex-col items-center gap-6 py-14 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Aracın hakkında gerçeği öğrenmeye hazır mısın?
          </h2>
          <p className="max-w-xl text-blue-100">
            Randevunu bugün oluştur, uzman eksperlerimiz aracın gerçek durumunu senin için ortaya
            çıkarsın.
          </p>
          <Link
            href="/randevu-al"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Hemen Randevu Al <ArrowRight className="h-4 w-4" />
          </Link>
        </Container>
      </section>
    </>
  );
}
