import type { Metadata } from "next";
import Link from "next/link";
import { listPackages } from "@/lib/data/packages";
import PageHeader from "../_components/PageHeader";
import { ActiveBadge } from "../_components/StatusBadge";
import { buttonPrimaryClass, tableWrapClass, tdClass, thClass } from "../_components/ui";
import ConfirmSubmitButton from "../_components/ConfirmSubmitButton";
import { deletePackageAction } from "./actions";

export const metadata: Metadata = { title: "Paketler" };

export default async function AdminPackagesPage() {
  const packages = await listPackages();

  return (
    <div>
      <PageHeader
        title="Paketler"
        description="Ekspertiz paketlerini ve fiyatlarını yönetin."
        action={
          <Link href="/admin/packages/new" className={buttonPrimaryClass}>
            + Yeni Paket
          </Link>
        }
      />

      <div className={tableWrapClass}>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className={thClass}>Sıra</th>
              <th className={thClass}>Paket</th>
              <th className={thClass}>Fiyat</th>
              <th className={thClass}>Öne Çıkan</th>
              <th className={thClass}>Durum</th>
              <th className={thClass}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {packages.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className={tdClass}>{p.sortOrder}</td>
                <td className={tdClass + " font-medium text-slate-900"}>{p.name}</td>
                <td className={tdClass}>{p.price.toLocaleString("tr-TR")} ₺</td>
                <td className={tdClass}>{p.highlighted ? "Evet" : "-"}</td>
                <td className={tdClass}>
                  <ActiveBadge active={p.active} />
                </td>
                <td className={tdClass}>
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/packages/${p.id}`} className="font-semibold text-blue-700 hover:underline">
                      Düzenle
                    </Link>
                    <form action={deletePackageAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <ConfirmSubmitButton
                        confirmMessage={`"${p.name}" paketini silmek istediğinize emin misiniz?`}
                        className="font-semibold text-red-600 hover:underline"
                      >
                        Sil
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {packages.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                  Henüz paket eklenmedi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
