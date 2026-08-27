import Link from "next/link";
import type { Metadata } from "next";
import { appointmentStats, listAppointments } from "@/lib/data/appointments";
import { countUnreadMessages } from "@/lib/data/contactMessages";
import { listBranches } from "@/lib/data/branches";
import { StatusBadge } from "./_components/StatusBadge";
import { cardClass } from "./_components/ui";

export const metadata: Metadata = { title: "Panel" };

export default async function AdminDashboardPage() {
  const stats = appointmentStats();
  const unread = countUnreadMessages();
  const recent = listAppointments().slice(0, 6);
  const branches = new Map(listBranches().map((b) => [b.id, b.name]));

  const cards = [
    { label: "Bugünkü Randevular", value: stats.today },
    { label: "Bekleyen Randevular", value: stats.pending },
    { label: "Onaylanan Randevular", value: stats.confirmed },
    { label: "Toplam Randevu", value: stats.total },
    { label: "Okunmamış Mesaj", value: unread },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Merhaba 👋</h1>
        <p className="mt-1 text-sm text-slate-500">
          OtoVizör Ekspertiz yönetim paneline hoş geldiniz. Sitedeki içerikleri ve randevuları
          buradan yönetebilirsiniz.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className={cardClass}>
            <p className="text-2xl font-semibold text-slate-900">{c.value}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className={cardClass}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Son Randevular</h2>
          <Link href="/admin/appointments" className="text-sm font-medium text-blue-700 hover:underline">
            Tümünü Gör →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-slate-500">Henüz randevu bulunmuyor.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recent.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{a.fullName}</p>
                  <p className="text-xs text-slate-500">
                    {branches.get(a.branchId) ?? "Şube"} · {a.appointmentDate} {a.timeSlot} ·{" "}
                    {a.trackingCode}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
