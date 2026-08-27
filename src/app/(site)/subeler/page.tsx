import type { Metadata } from "next";
import { listBranches } from "@/lib/data/branches";
import { Section, Container } from "../_components/Section";
import BranchesGrid from "./BranchesGrid";

export const metadata: Metadata = {
  title: "Şubelerimiz",
  description: "Cesa Oto Ekspertiz şubelerini ve iletişim bilgilerini inceleyin.",
};

export default async function BranchesPage() {
  const branches = await listBranches({ onlyActive: true });

  return (
    <>
      <div className="border-b border-slate-200 bg-slate-950 py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Şubelerimiz</h1>
            <p className="mt-4 text-slate-300">
              Size en yakın şubeyi seçin veya mobil ekspertiz ekibimizi bulunduğunuz yere çağırın.
            </p>
          </div>
        </Container>
      </div>

      <Section>
        <BranchesGrid branches={branches} />
      </Section>
    </>
  );
}
