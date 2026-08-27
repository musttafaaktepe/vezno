import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppointmentById } from "@/lib/data/appointments";
import { getBranchById } from "@/lib/data/branches";
import { getPackageById } from "@/lib/data/packages";
import PageHeader from "../../_components/PageHeader";
import { StatusBadge } from "../../_components/StatusBadge";
import { cardClass, selectClass } from "../../_components/ui";
import ConfirmSubmitButton from "../../_components/ConfirmSubmitButton";
import SubmitButton from "../../_components/SubmitButton";
import { deleteAppointmentAction, updateAppointmentStatusAction } from "../actions";

export const metadata: Metadata = { title: "Randevu Detayı" };

export default async function AdminAppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const appointment = getAppointmentById(id);
  if (!appointment) notFound();

  const branch = getBranchById(appointment.branchId);
  const pkg = appointment.packageId ? getPackageById(appointment.packageId) : null;

  return (
    <div>
      <PageHeader
        title={`Randevu · ${appointment.trackingCode}`}
        description={`Oluşturulma: ${appointment.createdAt}`}
        action={
          <Link href="/admin/appointments" className="text-sm font-medium text-blue-700 hover:underline">
            ← Listeye Dön
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className={cardClass}>
            <h2 className="text-sm font-semibold text-slate-900">Müşteri Bilgileri</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">Ad Soyad</dt>
                <dd className="text-sm font-medium text-slate-900">{appointment.fullName}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Telefon</dt>
                <dd className="text-sm font-medium text-slate-900">{appointment.phone}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">E-posta</dt>
                <dd className="text-sm font-medium text-slate-900">{appointment.email ?? "-"}</dd>
              </div>
            </dl>
          </div>

          <div className={cardClass}>
            <h2 className="text-sm font-semibold text-slate-900">Randevu Bilgileri</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">Şube</dt>
                <dd className="text-sm font-medium text-slate-900">{branch?.name ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Hizmet Türü</dt>
                <dd className="text-sm font-medium text-slate-900">
                  {appointment.serviceType === "MOBILE" ? "Mobil Ekspertiz" : "Şubede Ekspertiz"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Tarih / Saat</dt>
                <dd className="text-sm font-medium text-slate-900">
                  {appointment.appointmentDate} · {appointment.timeSlot}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Paket</dt>
                <dd className="text-sm font-medium text-slate-900">{pkg?.name ?? "Belirtilmedi"}</dd>
              </div>
            </dl>
          </div>

          <div className={cardClass}>
            <h2 className="text-sm font-semibold text-slate-900">Araç Bilgileri</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <dt className="text-xs text-slate-500">Plaka</dt>
                <dd className="text-sm font-medium text-slate-900">{appointment.plate ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Marka</dt>
                <dd className="text-sm font-medium text-slate-900">{appointment.vehicleBrand ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Model</dt>
                <dd className="text-sm font-medium text-slate-900">{appointment.vehicleModel ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Yıl</dt>
                <dd className="text-sm font-medium text-slate-900">{appointment.vehicleYear ?? "-"}</dd>
              </div>
            </dl>
          </div>

          {appointment.note && (
            <div className={cardClass}>
              <h2 className="text-sm font-semibold text-slate-900">Not</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{appointment.note}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className={cardClass}>
            <h2 className="text-sm font-semibold text-slate-900">Durum</h2>
            <div className="mt-3">
              <StatusBadge status={appointment.status} />
            </div>
            <form action={updateAppointmentStatusAction} className="mt-4 flex flex-col gap-3">
              <input type="hidden" name="id" value={appointment.id} />
              <select name="status" defaultValue={appointment.status} className={selectClass}>
                <option value="PENDING">Beklemede</option>
                <option value="CONFIRMED">Onaylandı</option>
                <option value="COMPLETED">Tamamlandı</option>
                <option value="CANCELLED">İptal Edildi</option>
              </select>
              <SubmitButton>Durumu Güncelle</SubmitButton>
            </form>
          </div>

          <div className={cardClass}>
            <h2 className="text-sm font-semibold text-red-700">Tehlikeli Alan</h2>
            <p className="mt-2 text-xs text-slate-500">
              Bu randevuyu kalıcı olarak siler, geri alınamaz.
            </p>
            <form action={deleteAppointmentAction} className="mt-4">
              <input type="hidden" name="id" value={appointment.id} />
              <ConfirmSubmitButton
                confirmMessage="Bu randevuyu silmek istediğinize emin misiniz?"
                className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100"
              >
                Randevuyu Sil
              </ConfirmSubmitButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
