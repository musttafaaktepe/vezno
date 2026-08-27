import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getAppointmentByTrackingCode } from "@/lib/data/appointments";
import { getBranchById } from "@/lib/data/branches";
import { getPackageById } from "@/lib/data/packages";
import { Section, Container } from "../../_components/Section";

export const metadata: Metadata = {
  title: "Randevu Alındı",
  robots: { index: false, follow: false },
};

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const appointment = code ? await getAppointmentByTrackingCode(code) : null;

  if (!appointment) {
    return (
      <Section>
        <Container className="text-center">
          <p className="text-slate-600">Randevu bulunamadı.</p>
          <Link href="/randevu-al" className="mt-4 inline-block text-blue-700 hover:underline">
            Yeniden randevu oluştur →
          </Link>
        </Container>
      </Section>
    );
  }

  const branch = await getBranchById(appointment.branchId);
  const pkg = appointment.packageId ? await getPackageById(appointment.packageId) : null;

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-xl rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Randevunuz Alındı!</h1>
          <p className="mt-2 text-sm text-slate-600">
            Randevu talebiniz iletildi, şubemiz en kısa sürede onay için sizinle iletişime
            geçecektir.
          </p>

          <div className="mt-6 rounded-xl bg-white p-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Takip Kodunuz
            </p>
            <p className="mt-1 text-2xl font-bold tracking-wide text-blue-700">
              {appointment.trackingCode}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Bu kodu ve telefon numaranızı randevu durumunu sorgulamak için saklayın.
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-500">Şube</dt>
                <dd className="font-medium text-slate-900">{branch?.name ?? "-"}</dd>
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
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={`/randevu-sorgula?code=${appointment.trackingCode}`}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Randevumu Sorgula
            </Link>
            <Link
              href="/"
              className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Anasayfaya Dön
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
