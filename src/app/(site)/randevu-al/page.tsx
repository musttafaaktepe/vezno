import type { Metadata } from "next";
import { listBranches } from "@/lib/data/branches";
import { listPackages } from "@/lib/data/packages";
import { Section, Container } from "../_components/Section";
import BookingForm from "./BookingForm";

export const metadata: Metadata = {
  title: "Randevu Al",
  description: "OtoVizör Ekspertiz'te online randevu oluşturun.",
};

type SearchParams = { branch?: string; package?: string; type?: string };

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [branches, packages] = await Promise.all([
    listBranches({ onlyActive: true }),
    listPackages({ onlyActive: true }),
  ]);

  return (
    <>
      <div className="border-b border-slate-200 bg-slate-950 py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Randevu Al</h1>
            <p className="mt-4 text-slate-300">
              Aşağıdaki formu doldurarak birkaç dakikada online randevunuzu oluşturabilirsiniz.
            </p>
          </div>
        </Container>
      </div>

      <Section>
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 p-6 sm:p-8">
          <BookingForm
            branches={branches}
            packages={packages}
            defaultBranchSlug={params.branch}
            defaultPackageSlug={params.package}
            defaultServiceType={params.type === "mobile" ? "MOBILE" : "BRANCH"}
          />
        </div>
      </Section>
    </>
  );
}
