import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getServiceBySlug, listServices } from "@/lib/data/services";
import { Section, Container } from "../../_components/Section";
import ServiceIcon from "../../_components/ServiceIcon";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return { title: service.title, description: service.summary };
}

export default async function ServiceDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service || !service.active) notFound();

  const otherServices = listServices({ onlyActive: true }).filter((s) => s.id !== service.id);

  return (
    <>
      <div className="border-b border-slate-200 bg-slate-950 py-16">
        <Container>
          <nav className="text-sm text-slate-400">
            <Link href="/hizmetler" className="hover:text-white">
              Hizmetler
            </Link>{" "}
            / <span className="text-white">{service.title}</span>
          </nav>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-white">
              <ServiceIcon icon={service.icon} className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{service.title}</h1>
          </div>
        </Container>
      </div>

      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-lg leading-relaxed text-slate-700">{service.description}</p>
            <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <p className="flex items-start gap-2 text-sm text-blue-900">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                Bu kontrol, tüm ekspertiz paketlerimizde standart olarak yer alır. Sonuçlar
                fotoğraflı ve puanlı olarak raporunda sunulur.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/randevu-al"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Randevu Al <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/paketler"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Paketleri İncele
              </Link>
            </div>
          </div>

          <aside>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Diğer Hizmetlerimiz
            </h2>
            <ul className="mt-4 flex flex-col gap-1">
              {otherServices.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/hizmetler/${s.slug}`}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <ServiceIcon icon={s.icon} className="h-4 w-4 text-blue-700" />
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>
    </>
  );
}
