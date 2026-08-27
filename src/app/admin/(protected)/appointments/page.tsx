import type { Metadata } from "next";
import Link from "next/link";
import { listAppointments } from "@/lib/data/appointments";
import { listBranches } from "@/lib/data/branches";
import { listPackages } from "@/lib/data/packages";
import PageHeader from "../_components/PageHeader";
import { StatusBadge } from "../_components/StatusBadge";
import { inputClass, selectClass, tableWrapClass, tdClass, thClass } from "../_components/ui";
import type { AppointmentStatus } from "@/lib/data/types";

export const metadata: Metadata = { title: "Randevular" };

const STATUS_OPTIONS: { value: AppointmentStatus | ""; label: string }[] = [
  { value: "", label: "Tüm Durumlar" },
  { value: "PENDING", label: "Beklemede" },
  { value: "CONFIRMED", label: "Onaylandı" },
  { value: "COMPLETED", label: "Tamamlandı" },
  { value: "CANCELLED", label: "İptal Edildi" },
];

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; branch?: string }>;
}) {
  const { status, q, branch } = await searchParams;
  const [branches, packages, appointments] = await Promise.all([
    listBranches(),
    listPackages(),
    listAppointments({
      status: (status as AppointmentStatus) || undefined,
      branchId: branch || undefined,
      q: q || undefined,
    }),
  ]);
  const branchMap = new Map(branches.map((b) => [b.id, b.name]));
  const packageMap = new Map(packages.map((p) => [p.id, p.name]));

  return (
    <div>
      <PageHeader title="Randevular" description={`${appointments.length} randevu listeleniyor`} />

      <form method="get" className="mb-5 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="İsim, telefon, plaka veya takip kodu ara"
          className={inputClass + " max-w-xs"}
        />
        <select name="status" defaultValue={status ?? ""} className={selectClass + " max-w-[160px]"}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select name="branch" defaultValue={branch ?? ""} className={selectClass + " max-w-[220px]"}>
          <option value="">Tüm Şubeler</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Filtrele
        </button>
        {(status || q || branch) && (
          <Link
            href="/admin/appointments"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Temizle
          </Link>
        )}
      </form>

      <div className={tableWrapClass}>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className={thClass}>Takip Kodu</th>
              <th className={thClass}>Müşteri</th>
              <th className={thClass}>Şube</th>
              <th className={thClass}>Tarih / Saat</th>
              <th className={thClass}>Paket</th>
              <th className={thClass}>Durum</th>
              <th className={thClass}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className={tdClass + " font-mono text-xs font-semibold text-slate-900"}>
                  {a.trackingCode}
                </td>
                <td className={tdClass}>
                  <p className="font-medium text-slate-900">{a.fullName}</p>
                  <p className="text-xs text-slate-500">{a.phone}</p>
                </td>
                <td className={tdClass}>{branchMap.get(a.branchId) ?? "-"}</td>
                <td className={tdClass}>
                  {a.appointmentDate} <br /> {a.timeSlot}
                </td>
                <td className={tdClass}>{a.packageId ? packageMap.get(a.packageId) : "-"}</td>
                <td className={tdClass}>
                  <StatusBadge status={a.status} />
                </td>
                <td className={tdClass}>
                  <Link
                    href={`/admin/appointments/${a.id}`}
                    className="font-semibold text-blue-700 hover:underline"
                  >
                    Detay
                  </Link>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
