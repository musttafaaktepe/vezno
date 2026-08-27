import type { Metadata } from "next";
import { listFaqs } from "@/lib/data/faqs";
import { Section, Container } from "../_components/Section";

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular",
  description: "OtoVizör Ekspertiz hakkında merak edilen soruların cevapları.",
};

export default async function FaqPage() {
  const faqs = await listFaqs({ onlyActive: true });

  return (
    <>
      <div className="border-b border-slate-200 bg-slate-950 py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Sık Sorulan Sorular</h1>
            <p className="mt-4 text-slate-300">
              Aklınıza takılan bir şey mi var? Aşağıda bulamazsanız bize ulaşmaktan çekinmeyin.
            </p>
          </div>
        </Container>
      </div>

      <Section>
        <div className="mx-auto max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {faqs.map((f) => (
            <details key={f.id} className="group p-6">
              <summary className="cursor-pointer list-none text-base font-semibold text-slate-900 marker:content-none">
                <span className="flex items-center justify-between gap-4">
                  {f.question}
                  <span className="shrink-0 text-xl leading-none text-slate-400 transition group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.answer}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
