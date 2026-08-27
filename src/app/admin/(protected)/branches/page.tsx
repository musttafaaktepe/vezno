import type { Metadata } from "next";
import Link from "next/link";
import { listBranches } from "@/lib/data/branches";
import PageHeader from "../_components/PageHeader";
import { ActiveBadge } from "../_components/StatusBadge";
import { buttonPrimaryClass, tableWrapClass, tdClass, thClass } from "../_components/ui";
import ConfirmSubmitButton from "../_components/ConfirmSubmitButton";
import { deleteBranchAction } from "./actions";

export const metadata: Metadata = { title: "Şubeler" };

export default async function AdminBranchesPage() {
  const branches = await listBranches();

  return (
    <div>
      <PageHeader
        title="Şubeler"
        description="Şube bilgilerini ve iletişim detaylarını yönetin."
        action={
          <Link href="/admin/branches/new" className={buttonPrimaryClass}>
            + Yeni Şube
          </Link>
        }
      />

      <div className={tableWrapClass}>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className={thClass}>Şube</th>
              <th className={thClass}>Şehir</th>
              <th className={thClass}>Telefon</th>
              <th className={thClass}>Durum</th>
              <th className={thClass}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {branches.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50">
                <td className={tdClass + " font-medium text-slate-900"}>{b.name}</td>
                <td className={tdClass}>
                  {b.city}
                  {b.district ? ` / ${b.district}` : ""}
                </td>
                <td className={tdClass}>{b.phone}</td>
                <td className={tdClass}>
                  <ActiveBadge active={b.active} />
                </td>
                <td className={tdClass}>
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/branches/${b.id}`} className="font-semibold text-blue-700 hover:underline">
                      Düzenle
                    </Link>
                    <form action={deleteBranchAction}>
                      <input type="hidden" name="id" value={b.id} />
                      <ConfirmSubmitButton
                        confirmMessage={`"${b.name}" şubesini silmek istediğinize emin misiniz?`}
                        className="font-semibold text-red-600 hover:underline"
                      >
                        Sil
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {branches.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                  Henüz şube eklenmedi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
