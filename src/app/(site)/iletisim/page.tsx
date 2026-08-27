import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/data/settings";
import { listBranches } from "@/lib/data/branches";
import { Section, Container } from "../_components/Section";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Cesa Oto Ekspertiz ile iletişime geçin, sorularınızı bize iletin.",
};

export default async function ContactPage() {
  const [settings, branches] = await Promise.all([getSiteSettings(), listBranches({ onlyActive: true })]);

  return (
    <>
      <div className="border-b border-slate-200 bg-slate-950 py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">İletişim</h1>
            <p className="mt-4 text-slate-300">
              Sorularınız için bize yazın, size en kısa sürede geri dönelim.
            </p>
          </div>
        </Container>
      </div>

      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">Bize Ulaşın</h2>
            <p className="mt-1 text-sm text-slate-500">
              Formu doldurun, ekibimiz en kısa sürede size dönüş yapsın.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Genel Merkez
              </h3>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-slate-700">
                {settings.address && (
                  <li className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                    {settings.address}
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-blue-700" />
                  <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-blue-700">
                    {settings.phone}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-blue-700" />
                  <a href={`mailto:${settings.email}`} className="hover:text-blue-700">
                    {settings.email}
                  </a>
                </li>
                {settings.workingHours && (
                  <li className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                    {settings.workingHours}
                  </li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Şubelerimiz
              </h3>
              <ul className="mt-4 flex flex-col gap-3 text-sm">
                {branches.slice(0, 6).map((b) => (
                  <li key={b.id}>
                    <p className="font-medium text-slate-900">{b.name}</p>
                    <a
                      href={`tel:${b.phone.replace(/\s/g, "")}`}
                      className="text-slate-500 hover:text-blue-700"
                    >
                      {b.phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
