import type { Metadata } from "next";
import Link from "next/link";
import { listCampaigns } from "@/lib/data/campaigns";
import PageHeader from "../_components/PageHeader";
import { ActiveBadge } from "../_components/StatusBadge";
import { buttonPrimaryClass, tableWrapClass, tdClass, thClass } from "../_components/ui";
import ConfirmSubmitButton from "../_components/ConfirmSubmitButton";
import { deleteCampaignAction } from "./actions";

export const metadata: Metadata = { title: "Kampanyalar" };

export default async function AdminCampaignsPage() {
  const campaigns = listCampaigns();

  return (
    <div>
      <PageHeader
        title="Kampanyalar"
        description="Sitede gösterilen kampanya ve fırsatları yönetin."
        action={
          <Link href="/admin/campaigns/new" className={buttonPrimaryClass}>
            + Yeni Kampanya
          </Link>
        }
      />

      <div className={tableWrapClass}>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className={thClass}>Başlık</th>
              <th className={thClass}>Etiket</th>
              <th className={thClass}>Son Geçerlilik</th>
              <th className={thClass}>Durum</th>
              <th className={thClass}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {campaigns.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className={tdClass + " font-medium text-slate-900"}>{c.title}</td>
                <td className={tdClass}>{c.badge ?? "-"}</td>
                <td className={tdClass}>{c.validUntil ?? "-"}</td>
                <td className={tdClass}>
                  <ActiveBadge active={c.active} />
                </td>
                <td className={tdClass}>
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/campaigns/${c.id}`} className="font-semibold text-blue-700 hover:underline">
                      Düzenle
                    </Link>
                    <form action={deleteCampaignAction}>
                      <input type="hidden" name="id" value={c.id} />
                      <ConfirmSubmitButton
                        confirmMessage={`"${c.title}" kampanyasını silmek istediğinize emin misiniz?`}
                        className="font-semibold text-red-600 hover:underline"
                      >
                        Sil
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                  Henüz kampanya eklenmedi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
