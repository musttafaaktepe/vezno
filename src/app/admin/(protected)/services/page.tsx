import type { Metadata } from "next";
import Link from "next/link";
import { listServices } from "@/lib/data/services";
import PageHeader from "../_components/PageHeader";
import { ActiveBadge } from "../_components/StatusBadge";
import { buttonPrimaryClass, tableWrapClass, tdClass, thClass } from "../_components/ui";
import ConfirmSubmitButton from "../_components/ConfirmSubmitButton";
import { deleteServiceAction } from "./actions";

export const metadata: Metadata = { title: "Hizmetler" };

export default async function AdminServicesPage() {
  const services = listServices();

  return (
    <div>
      <PageHeader
        title="Hizmetler"
        description="Sitede listelenen ekspertiz hizmetlerini yönetin."
        action={
          <Link href="/admin/services/new" className={buttonPrimaryClass}>
            + Yeni Hizmet
          </Link>
        }
      />

      <div className={tableWrapClass}>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className={thClass}>Sıra</th>
              <th className={thClass}>Başlık</th>
              <th className={thClass}>Özet</th>
              <th className={thClass}>Durum</th>
              <th className={thClass}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className={tdClass}>{s.sortOrder}</td>
                <td className={tdClass + " font-medium text-slate-900"}>{s.title}</td>
                <td className={tdClass + " max-w-sm truncate"}>{s.summary}</td>
                <td className={tdClass}>
                  <ActiveBadge active={s.active} />
                </td>
                <td className={tdClass}>
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/services/${s.id}`} className="font-semibold text-blue-700 hover:underline">
                      Düzenle
                    </Link>
                    <form action={deleteServiceAction}>
                      <input type="hidden" name="id" value={s.id} />
                      <ConfirmSubmitButton
                        confirmMessage={`"${s.title}" hizmetini silmek istediğinize emin misiniz?`}
                        className="font-semibold text-red-600 hover:underline"
                      >
                        Sil
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                  Henüz hizmet eklenmedi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
