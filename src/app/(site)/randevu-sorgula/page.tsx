import type { Metadata } from "next";
import Link from "next/link";
import { Search, XCircle } from "lucide-react";
import { findAppointmentByTrackingCodeAndPhone } from "@/lib/data/appointments";
import { getBranchById } from "@/lib/data/branches";
import { getPackageById } from "@/lib/data/packages";
import { Section, Container } from "../_components/Section";

export const metadata: Metadata = {
  title: "Randevumu Sorgula",
  description: "Takip kodunuz ve telefon numaranız ile randevu durumunuzu sorgulayın.",
  robots: { index: false, follow: false },
};

const STEPS = [
  { key: "PENDING", label: "Beklemede" },
  { key: "CONFIRMED", label: "Onaylandı" },
  { key: "COMPLETED", label: "Tamamlandı" },
] as const;

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export default async function TrackAppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; phone?: string }>;
}) {
  const { code, phone } = await searchParams;
  const hasQuery = Boolean(code && phone);
  const appointment = hasQuery ? findAppointmentByTrackingCodeAndPhone(code!, phone!) : null;
  const branch = appointment ? getBranchById(appointment.branchId) : null;
  const pkg = appointment?.packageId ? getPackageById(appointment.packageId) : null;
  const currentStepIndex = appointment
    ? STEPS.findIndex((s) => s.key === appointment.status)
    : -1;

  return (
    <>
      <div className="border-b border-slate-200 bg-slate-950 py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Randevumu Sorgula</h1>
            <p className="mt-4 text-slate-300">
              Randevu oluştururken size verilen takip kodu ve telefon numaranız ile randevu
              durumunuzu görüntüleyin.
            </p>
          </div>
        </Container>
      </div>

      <Section>
        <div className="mx-auto max-w-xl">
          <form method="get" className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="code" className="text-sm font-medium text-slate-700">
                Takip Kodu
              </label>
              <input
                id="code"
                name="code"
                required
                defaultValue={code}
                placeholder="VZ-XXXXXX"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                Telefon Numarası
              </label>
              <input
                id="phone"
                name="phone"
                required
                defaultValue={phone}
                placeholder="05xx xxx xx xx"
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
            >
              <Search className="h-4 w-4" /> Sorgula
            </button>
          </form>

          {hasQuery && !appointment && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>
                Girdiğiniz bilgilerle eşleşen bir randevu bulunamadı. Takip kodunuzu ve telefon
                numaranızı kontrol edip tekrar deneyin.
              </p>
            </div>
          )}

          {appointment && branch && (
            <div className="mt-6 rounded-2xl border border-slate-200 p-6 sm:p-8">
              {appointment.status !== "CANCELLED" ? (
                <ol className="flex items-center justify-between">
                  {STEPS.map((step, i) => (
                    <li key={step.key} className="flex flex-1 items-center last:flex-none">
                      <div className="flex flex-col items-center gap-2">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                            i <= currentStepIndex
                              ? "bg-blue-700 text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            i <= currentStepIndex ? "text-slate-900" : "text-slate-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <span
                          className={`mx-2 h-0.5 flex-1 ${
                            i < currentStepIndex ? "bg-blue-700" : "bg-slate-100"
                          }`}
                        />
                      )}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700">
                  Bu randevu iptal edilmiştir.
                </p>
              )}

              <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-slate-500">Şube</dt>
                  <dd className="font-medium text-slate-900">{branch.name}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Tarih / Saat</dt>
                  <dd className="font-medium text-slate-900">
                    {appointment.appointmentDate} · {appointment.timeSlot}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Paket</dt>
                  <dd className="font-medium text-slate-900">{pkg?.name ?? "Belirtilmedi"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Hizmet Türü</dt>
                  <dd className="font-medium text-slate-900">
                    {appointment.serviceType === "MOBILE" ? "Mobil Ekspertiz" : "Şubede Ekspertiz"}
                  </dd>
                </div>
              </dl>

              <p className="mt-6 text-center text-sm text-slate-500">
                Randevunuzda değişiklik yapmak için{" "}
                <a href={`tel:${branch.phone.replace(/\s/g, "")}`} className="font-semibold text-blue-700">
                  {branch.phone}
                </a>{" "}
                numaralı şubemizi arayabilirsiniz.
              </p>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            Henüz randevunuz yok mu?{" "}
            <Link href="/randevu-al" className="font-semibold text-blue-700 hover:underline">
              Hemen randevu alın
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}
