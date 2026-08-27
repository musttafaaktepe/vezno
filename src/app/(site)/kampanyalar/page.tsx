import type { Metadata } from "next";
import Link from "next/link";
import { Tag } from "lucide-react";
import { listCampaigns } from "@/lib/data/campaigns";
import { Section, Container } from "../_components/Section";

export const metadata: Metadata = {
  title: "Kampanyalar",
  description: "OtoVizör Ekspertiz'in güncel kampanya ve fırsatlarını kaçırmayın.",
};

export default function CampaignsPage() {
  const campaigns = listCampaigns({ onlyActive: true });

  return (
    <>
      <div className="border-b border-slate-200 bg-slate-950 py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Kampanyalar</h1>
            <p className="mt-4 text-slate-300">Güncel fırsatlarımızdan yararlanarak daha avantajlı bir ekspertiz deneyimi yaşayın.</p>
          </div>
        </Container>
      </div>

      <Section>
        {campaigns.length === 0 ? (
          <p className="text-center text-sm text-slate-500">
            Şu anda aktif bir kampanya bulunmuyor, güncellemeler için takipte kalın.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <div key={c.id} className="flex flex-col rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-amber-600" />
                  {c.badge && (
                    <span className="inline-flex items-center rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white">
                      {c.badge}
                    </span>
                  )}
                </div>
                <h2 className="mt-4 text-base font-semibold text-slate-900">{c.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-700">{c.description}</p>
                {c.validUntil && (
                  <p className="mt-3 text-xs font-medium text-amber-700">
                    Son geçerlilik: {c.validUntil}
                  </p>
                )}
                <Link
                  href="/randevu-al"
                  className="mt-5 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Randevu Al
                </Link>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
