import type { Metadata } from "next";
import Link from "next/link";
import { listFaqs } from "@/lib/data/faqs";
import PageHeader from "../_components/PageHeader";
import { ActiveBadge } from "../_components/StatusBadge";
import { buttonPrimaryClass, tableWrapClass, tdClass, thClass } from "../_components/ui";
import ConfirmSubmitButton from "../_components/ConfirmSubmitButton";
import { deleteFaqAction } from "./actions";

export const metadata: Metadata = { title: "S.S.S." };

export default async function AdminFaqsPage() {
  const faqs = await listFaqs();

  return (
    <div>
      <PageHeader
        title="Sık Sorulan Sorular"
        description="Sitedeki S.S.S. bölümünde gösterilen soruları yönetin."
        action={
          <Link href="/admin/faqs/new" className={buttonPrimaryClass}>
            + Yeni Soru
          </Link>
        }
      />

      <div className={tableWrapClass}>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className={thClass}>Sıra</th>
              <th className={thClass}>Soru</th>
              <th className={thClass}>Durum</th>
              <th className={thClass}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {faqs.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50">
                <td className={tdClass}>{f.sortOrder}</td>
                <td className={tdClass + " max-w-lg font-medium text-slate-900"}>{f.question}</td>
                <td className={tdClass}>
                  <ActiveBadge active={f.active} />
                </td>
                <td className={tdClass}>
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/faqs/${f.id}`} className="font-semibold text-blue-700 hover:underline">
                      Düzenle
                    </Link>
                    <form action={deleteFaqAction}>
                      <input type="hidden" name="id" value={f.id} />
                      <ConfirmSubmitButton
                        confirmMessage="Bu soruyu silmek istediğinize emin misiniz?"
                        className="font-semibold text-red-600 hover:underline"
                      >
                        Sil
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {faqs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">
                  Henüz soru eklenmedi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
