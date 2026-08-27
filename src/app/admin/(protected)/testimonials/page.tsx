import type { Metadata } from "next";
import Link from "next/link";
import { listTestimonials } from "@/lib/data/testimonials";
import PageHeader from "../_components/PageHeader";
import { ActiveBadge } from "../_components/StatusBadge";
import { buttonPrimaryClass, tableWrapClass, tdClass, thClass } from "../_components/ui";
import ConfirmSubmitButton from "../_components/ConfirmSubmitButton";
import { deleteTestimonialAction } from "./actions";

export const metadata: Metadata = { title: "Yorumlar" };

export default async function AdminTestimonialsPage() {
  const testimonials = listTestimonials();

  return (
    <div>
      <PageHeader
        title="Müşteri Yorumları"
        description="Anasayfada gösterilen müşteri yorumlarını yönetin."
        action={
          <Link href="/admin/testimonials/new" className={buttonPrimaryClass}>
            + Yeni Yorum
          </Link>
        }
      />

      <div className={tableWrapClass}>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className={thClass}>Müşteri</th>
              <th className={thClass}>Yorum</th>
              <th className={thClass}>Puan</th>
              <th className={thClass}>Durum</th>
              <th className={thClass}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {testimonials.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className={tdClass + " font-medium text-slate-900"}>
                  {t.name}
                  <p className="text-xs font-normal text-slate-500">
                    {[t.city, t.vehicle].filter(Boolean).join(" · ")}
                  </p>
                </td>
                <td className={tdClass + " max-w-sm truncate"}>{t.comment}</td>
                <td className={tdClass}>{"★".repeat(t.rating)}</td>
                <td className={tdClass}>
                  <ActiveBadge active={t.active} />
                </td>
                <td className={tdClass}>
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/testimonials/${t.id}`} className="font-semibold text-blue-700 hover:underline">
                      Düzenle
                    </Link>
                    <form action={deleteTestimonialAction}>
                      <input type="hidden" name="id" value={t.id} />
                      <ConfirmSubmitButton
                        confirmMessage={`"${t.name}" yorumunu silmek istediğinize emin misiniz?`}
                        className="font-semibold text-red-600 hover:underline"
                      >
                        Sil
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {testimonials.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                  Henüz yorum eklenmedi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
